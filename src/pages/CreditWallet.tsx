import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CreditTransaction {
  id: string;
  date: string;
  formation?: {
    name: string;
    id: string;
  };
  creditAmount: number;
  credits: number;
  costPerStudent?: number;
  creditsPerStudent?: number;
  students?: number;
  type: 'purchase' | 'consumption';
}

const CreditWallet = () => {
  // Mock data - in a real app this would come from an API
  const transactions: CreditTransaction[] = [
    {
      id: "1",
      date: "2024-01-15",
      creditAmount: 7500,
      credits: 1000,
      type: "purchase"
    },
    {
      id: "2",
      date: "2024-01-20",
      formation: {
        name: "Curso de Liderazgo Empresarial",
        id: "1"
      },
      creditAmount: 450,
      credits: -60,
      costPerStudent: 45,
      creditsPerStudent: 6,
      students: 10,
      type: "consumption"
    },
    {
      id: "3",
      date: "2024-02-01",
      formation: {
        name: "Formación en Marketing Digital",
        id: "2"
      },
      creditAmount: 562.5,
      credits: -75,
      costPerStudent: 37.5,
      creditsPerStudent: 5,
      students: 15,
      type: "consumption"
    },
    {
      id: "4",
      date: "2024-02-10",
      creditAmount: 3750,
      credits: 500,
      type: "purchase"
    },
    {
      id: "5",
      date: "2024-02-15",
      formation: {
        name: "Desarrollo de Habilidades de Comunicación",
        id: "3"
      },
      creditAmount: 300,
      credits: -40,
      costPerStudent: 30,
      creditsPerStudent: 4,
      students: 10,
      type: "consumption"
    }
  ];

    const { toast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);


  const totalCreditAmount = transactions.reduce((sum, t) => 
    sum + (t.type === 'purchase' ? t.creditAmount : -t.creditAmount), 0
  );
  
  const totalCredits = transactions.reduce((sum, t) => 
    sum + (t.type === 'purchase' ? t.credits : t.credits), 0
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleSolicitarCreditos = () => {
    // Simular envío de email al comercial
    setIsModalOpen(true);
    toast({
      title: "Solicitud enviada",
      description: "Hemos enviado tu solicitud al comercial responsable. Te contactarán pronto.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bolsa de créditos</h1>
        <p className="text-muted-foreground mt-2">
          Control de fluctuación de créditos de la empresa
        </p>
      </div>

      {/* Bolsa de Créditos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Bolsa de Créditos
          </CardTitle>
          <CardDescription>
            Créditos disponibles para formaciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                340 créditos disponibles
              </Badge>
            </div>
            <Button onClick={handleSolicitarCreditos} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Solicitar más horas
            </Button>
          </div>
        </CardContent>
      </Card>

       {/* Modal de Confirmación */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Solicitud Enviada
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                Tu solicitud de créditos adicionales ha sido enviada correctamente al comercial responsable.
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium text-foreground">¿Qué ocurre ahora?</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• El comercial revisará tu solicitud</li>
                  <li>• Te contactará en un plazo máximo de 24 horas</li>
                  <li>• Recibirás una propuesta personalizada</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsModalOpen(false)}>
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Formación</TableHead>
                  <TableHead className="text-right">Importe €</TableHead>
                  <TableHead className="text-right">Créditos</TableHead>
                  <TableHead className="text-right">Importe €/alumno</TableHead>
                  <TableHead className="text-right">Créditos/alumno</TableHead>
                  <TableHead className="text-right">Nº alumnos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>
                      {transaction.formation ? (
                        <Link 
                          to={`/action/${transaction.formation.id}`}
                          className="text-primary hover:underline"
                        >
                          {transaction.formation.name}
                        </Link>
                      ) : (
                        <Badge variant="secondary">Compra de créditos</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'purchase' ? '+' : '-'}{formatCurrency(Math.abs(transaction.creditAmount))}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'purchase' ? '+' : ''}{transaction.credits}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.costPerStudent ? formatCurrency(transaction.costPerStudent) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.creditsPerStudent || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.students || '-'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 font-semibold bg-muted/50">
                  <TableCell colSpan={2}>
                    <strong>TOTALES</strong>
                  </TableCell>
                  <TableCell className="text-right">
                    <strong className={totalCreditAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totalCreditAmount)}
                    </strong>
                  </TableCell>
                  <TableCell className="text-right">
                    <strong className={totalCredits >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {totalCredits}
                    </strong>
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditWallet;