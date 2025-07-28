import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Building2, FileText, CreditCard, Plus, Users } from "lucide-react";

interface Manager {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
}

const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddManagerOpen, setIsAddManagerOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreComercial: "LogTech",
    razonSocial: "LogTech Formación y Desarrollo S.L.",
    cif: "B12345678",
    via: "Calle Mayor",
    numero: "123",
    codigoPostal: "28001",
    municipio: "Madrid",
    provincia: "Madrid",
    telefono: "+34 91 123 45 67",
    email: "contacto@logtech.es"
  });
  
  const [managers, setManagers] = useState<Manager[]>([
    {
      id: 1,
      nombre: "Ana",
      apellidos: "García López",
      email: "ana.garcia@logtech.es",
      rol: "Gestor"
    },
    {
      id: 2,
      nombre: "Carlos",
      apellidos: "Martínez Ruiz",
      email: "carlos.martinez@logtech.es",
      rol: "Gestor"
    }
  ]);

  const [newManager, setNewManager] = useState({
    nombre: "",
    apellidos: "",
    email: ""
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSolicitarCreditos = () => {
    // Simular envío de email al comercial
    setIsModalOpen(true);
    toast({
      title: "Solicitud enviada",
      description: "Hemos enviado tu solicitud al comercial responsable. Te contactarán pronto.",
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Cambios guardados",
      description: "La información de la empresa ha sido actualizada correctamente.",
    });
  };

  const handleAddManager = () => {
    if (!newManager.nombre || !newManager.apellidos || !newManager.email) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
        variant: "destructive"
      });
      return;
    }

    const manager: Manager = {
      id: Date.now(),
      nombre: newManager.nombre,
      apellidos: newManager.apellidos,
      email: newManager.email,
      rol: "Gestor"
    };

    setManagers([...managers, manager]);
    setNewManager({ nombre: "", apellidos: "", email: "" });
    setIsAddManagerOpen(false);
    
    toast({
      title: "Invitación enviada",
      description: "Se ha enviado la invitación al nuevo gestor",
    });
  };

  const handleManagerInputChange = (field: string, value: string) => {
    setNewManager(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Configuración de la Empresa</h1>
        <p className="text-muted-foreground">Gestiona la información y configuración de tu empresa</p>
      </div>

      <Tabs defaultValue="empresa" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="empresa">Datos de la Empresa</TabsTrigger>
          <TabsTrigger value="gestores">Gestores de Formación</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="space-y-8">{/* ... keep existing code (all company data cards) */}

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

      {/* Datos de Identificación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Datos de Identificación
          </CardTitle>
          <CardDescription>
            Información básica de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombreComercial">Nombre Comercial</Label>
              <Input
                id="nombreComercial"
                value={formData.nombreComercial}
                onChange={(e) => handleInputChange('nombreComercial', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cif">CIF</Label>
              <Input
                id="cif"
                value={formData.cif}
                onChange={(e) => handleInputChange('cif', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="razonSocial">Razón Social Completa</Label>
            <Input
              id="razonSocial"
              value={formData.razonSocial}
              onChange={(e) => handleInputChange('razonSocial', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Domicilio Social */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Domicilio Social
          </CardTitle>
          <CardDescription>
            Dirección fiscal de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="via">Vía</Label>
              <Input
                id="via"
                value={formData.via}
                onChange={(e) => handleInputChange('via', e.target.value)}
                placeholder="Calle, Avenida, Plaza..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="codigoPostal">Código Postal</Label>
              <Input
                id="codigoPostal"
                value={formData.codigoPostal}
                onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio</Label>
              <Input
                id="municipio"
                value={formData.municipio}
                onChange={(e) => handleInputChange('municipio', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provincia">Provincia</Label>
              <Input
                id="provincia"
                value={formData.provincia}
                onChange={(e) => handleInputChange('provincia', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacto */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Información de Contacto
          </CardTitle>
          <CardDescription>
            Datos de contacto principales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="telefono" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} className="px-8">
            Guardar Cambios
          </Button>
        </div>
        </TabsContent>

        <TabsContent value="gestores" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Gestores de Formación</h2>
              <p className="text-muted-foreground">Administra los usuarios gestores de la plataforma</p>
            </div>
            <Button onClick={() => setIsAddManagerOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Añadir Gestor
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Lista de Gestores
              </CardTitle>
              <CardDescription>
                Usuarios con acceso a la gestión de formaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre y Email</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {managers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{manager.nombre} {manager.apellidos}</div>
                          <div className="text-sm text-muted-foreground">{manager.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{manager.rol}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

      {/* Modal para Añadir Gestor */}
      <Dialog open={isAddManagerOpen} onOpenChange={setIsAddManagerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Añadir Nuevo Gestor
            </DialogTitle>
            <DialogDescription>
              Completa los datos del nuevo gestor. Se enviará una invitación por email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={newManager.nombre}
                  onChange={(e) => handleManagerInputChange('nombre', e.target.value)}
                  placeholder="Nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  value={newManager.apellidos}
                  onChange={(e) => handleManagerInputChange('apellidos', e.target.value)}
                  placeholder="Apellidos"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailManager">Email</Label>
              <Input
                id="emailManager"
                type="email"
                value={newManager.email}
                onChange={(e) => handleManagerInputChange('email', e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddManagerOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddManager}>
              Enviar Invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;