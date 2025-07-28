import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { CalendarIcon, Users, CreditCard, Search, UserPlus, User, Mail, Clock, ArrowLeft, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addDays, isThursday, addWeeks, addBusinessDays, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  weeklyDedication: z.number().min(2, "Mínimo 2 horas semanales").max(40, "Máximo 40 horas semanales"),
});

interface Student {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
}

interface ActionDetail {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  weeklyDedication: number;
  duration: string;
  status: "solicited" | "scheduled" | "in-progress" | "completed";
  students: Array<{ id: number; name: string }>;
}

// Mock action details - same as in ActionDetail
const mockActionDetails: { [key: number]: ActionDetail } = {
  1: {
    id: 1,
    name: "SCRUM y metodologías Agile",
    startDate: "2025-08-15",
    endDate: "2025-10-15", 
    weeklyDedication: 8,
    duration: "24 h. 30 min.",
    status: "solicited",
    students: [
      { id: 1, name: "Ana García López" },
      { id: 2, name: "Carlos Rodríguez Martín" },
      { id: 3, name: "María Fernández Sánchez" },
    ]
  },
  2: {
    id: 2,
    name: "Python para Data Science",
    startDate: "2025-04-25",
    endDate: "2025-06-25", 
    weeklyDedication: 10,
    duration: "32 h. 15 min.",
    status: "scheduled",
    students: [
      { id: 4, name: "David López González" },
      { id: 5, name: "Laura Martínez Ruiz" },
    ]
  },
  3: {
    id: 3,
    name: "React y desarrollo web",
    startDate: "2025-03-20",
    endDate: "2025-05-20", 
    weeklyDedication: 12,
    duration: "28 h. 45 min.",
    status: "in-progress",
    students: [
      { id: 6, name: "Pedro Jiménez Morales" },
      { id: 7, name: "Carmen Ruiz Herrera" },
      { id: 8, name: "Alejandro Torres Vega" },
    ]
  },
};

// Mock students data
const mockStudents: Student[] = [
  {
    id: 1,
    name: "Ana",
    firstName: "García",
    lastName: "López",
    dni: "12345678A",
    phone: "666123456",
    email: "ana.garcia@email.com"
  },
  {
    id: 2,
    name: "Carlos",
    firstName: "Rodríguez",
    lastName: "Martín",
    dni: "87654321B",
    phone: "666234567",
    email: "carlos.rodriguez@email.com"
  },
  {
    id: 3,
    name: "María",
    firstName: "Fernández",
    lastName: "Sánchez",
    dni: "11223344C",
    phone: "666345678",
    email: "maria.fernandez@email.com"
  },
  {
    id: 4,
    name: "David",
    firstName: "López",
    lastName: "González",
    dni: "44332211D",
    phone: "666456789",
    email: "david.lopez@email.com"
  },
  {
    id: 5,
    name: "Laura",
    firstName: "Martínez",
    lastName: "Ruiz",
    dni: "55667788E",
    phone: "666567890",
    email: "laura.martinez@email.com"
  },
  {
    id: 6,
    name: "Pedro",
    firstName: "Jiménez",
    lastName: "Morales",
    dni: "66778899F",
    phone: "666678901",
    email: "pedro.jimenez@email.com"
  },
  {
    id: 7,
    name: "Carmen",
    firstName: "Ruiz",
    lastName: "Herrera",
    dni: "77889900G",
    phone: "666789012",
    email: "carmen.ruiz@email.com"
  },
  {
    id: 8,
    name: "Alejandro",
    firstName: "Torres",
    lastName: "Vega",
    dni: "88990011H",
    phone: "666890123",
    email: "alejandro.torres@email.com"
  }
];

export default function EditAction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [action, setAction] = useState<ActionDetail | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // All hooks must be called before any conditional returns
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(),
      weeklyDedication: 2,
    },
  });

  // Form for adding individual student
  const {
    register,
    handleSubmit: handleStudentSubmit,
    reset: resetStudentForm,
    formState: { errors }
  } = useForm<{
    name: string;
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
  }>();

  useEffect(() => {
    // Get action detail based on ID
    const actionId = parseInt(id || '1');
    const actionDetail = mockActionDetails[actionId] || mockActionDetails[1];
    setAction(actionDetail);
    setSelectedStudents(actionDetail.students.map(s => s.id));
    
    // Update form defaults when action is loaded
    form.reset({
      startDate: new Date(actionDetail.startDate),
      weeklyDedication: actionDetail.weeklyDedication,
    });
  }, [id, form]);

  if (!action) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  // Get the IDs of students that were originally in the action (cannot be removed)
  const originalStudentIds = action?.students.map(s => s.id) || [];

  // Helper functions
  const getFormationHours = () => {
    if (!action?.duration) return 20;
    return parseFloat(action.duration.split(' ')[0]);
  };

  const getCreditsPerStudent = () => {
    // Assuming 1 credit per 3 hours
    return Math.ceil(getFormationHours() / 3);
  };

  const calculateEndDate = (start: Date, weeklyHours: number) => {
    const totalHours = getFormationHours();
    const weeksNeeded = Math.ceil(totalHours / weeklyHours);
    return addWeeks(start, weeksNeeded);
  };

  const isValidStartDate = (date: Date) => {
    const minDate = addBusinessDays(new Date(), 4);
    return isThursday(date) && !isBefore(date, minDate);
  };

  const getCurrentCreditsConsumption = () => {
    return (action?.students.length || 0) * getCreditsPerStudent();
  };

  const getNewCreditsConsumption = () => {
    return selectedStudents.length * getCreditsPerStudent();
  };

  const getCreditsDifference = () => {
    return getNewCreditsConsumption() - getCurrentCreditsConsumption();
  };

  const watchedWeeklyDedication = form.watch("weeklyDedication");
  const watchedStartDate = form.watch("startDate");

  // Student management functions
  const handleSelectStudent = (studentId: number) => {
    // Don't allow deselecting original students
    if (originalStudentIds.includes(studentId)) {
      return;
    }
    
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    const filteredStudentIds = filteredStudents.map(s => s.id);
    const newStudentsOnly = filteredStudentIds.filter(id => !originalStudentIds.includes(id));
    
    // Check if all new students are selected
    const allNewStudentsSelected = newStudentsOnly.every(id => selectedStudents.includes(id));
    
    if (allNewStudentsSelected && newStudentsOnly.length > 0) {
      // Deselect only new students, keep original ones
      setSelectedStudents(prev => prev.filter(id => originalStudentIds.includes(id)));
    } else {
      // Select all students (original + new)
      setSelectedStudents([...originalStudentIds, ...newStudentsOnly]);
    }
  };

  const addIndividualStudent = (data: {
    name: string;
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
  }) => {
    // Basic validation
    if (!data.name.trim() || !data.firstName.trim() || !data.lastName.trim() || !data.dni.trim()) {
      toast.error("Los campos nombre, apellidos y DNI son obligatorios");
      return;
    }

    // Check if DNI already exists
    if (students.some(student => student.dni === data.dni)) {
      toast.error("Ya existe un alumno con ese DNI");
      return;
    }

    // Email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      toast.error("El formato del email no es correcto");
      return;
    }

    const newStudent: Student = {
      id: Math.max(...students.map(s => s.id)) + 1,
      name: data.name.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      dni: data.dni.trim().toUpperCase(),
      phone: data.phone.trim(),
      email: data.email.trim()
    };

    setStudents(prev => [...prev, newStudent]);
    toast.success(`${newStudent.name} ${newStudent.firstName} ha sido añadido correctamente`);
    resetStudentForm();
    setShowAddStudentModal(false);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.firstName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.dni.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Save the changes and navigate back
    toast.success("Acción formativa actualizada correctamente");
    navigate(`/action/${action?.id || 1}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/action/${action?.id || 1}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Editar acción formativa</h1>
              <p className="text-muted-foreground">Modifica los alumnos, fechas y dedicación de la acción</p>
            </div>
          </div>
        </div>

        {/* Action info - Sticky */}
        <div className="sticky top-0 z-20 bg-background pt-4 border-b pb-4">
          <Card className="bg-accent/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{action?.name || "Cargando..."}</h3>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {action?.duration || "0 h. 0 min."}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {getCreditsPerStudent()} créditos por alumno
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {getNewCreditsConsumption()} créditos totales
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getCreditsPerStudent()} × {selectedStudents.length} alumnos
                  </div>
                  {getCreditsDifference() !== 0 && (
                    <div className={`text-sm font-medium ${getCreditsDifference() > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                      {getCreditsDifference() > 0 ? '+' : ''}{getCreditsDifference()} créditos
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Students selection */}
          <div className="space-y-6">
            {/* Search and actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Buscar alumnos..." 
                    value={studentSearchTerm} 
                    onChange={e => setStudentSearchTerm(e.target.value)} 
                    className="pl-10 w-80" 
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{selectedStudents.length} seleccionados</span>
                </div>
              </div>

              <Dialog open={showAddStudentModal} onOpenChange={setShowAddStudentModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Añadir alumno
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Añadir nuevo alumno</DialogTitle>
                    <DialogDescription>
                      Completa los datos del nuevo alumno
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleStudentSubmit(addIndividualStudent)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input 
                        id="name" 
                        {...register("name", { required: true })} 
                        placeholder="Nombre del alumno" 
                      />
                      {errors.name && <p className="text-xs text-destructive">El nombre es obligatorio</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Primer apellido *</Label>
                        <Input 
                          id="firstName" 
                          {...register("firstName", { required: true })} 
                          placeholder="Primer apellido" 
                        />
                        {errors.firstName && <p className="text-xs text-destructive">Requerido</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Segundo apellido *</Label>
                        <Input 
                          id="lastName" 
                          {...register("lastName", { required: true })} 
                          placeholder="Segundo apellido" 
                        />
                        {errors.lastName && <p className="text-xs text-destructive">Requerido</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI *</Label>
                      <Input 
                        id="dni" 
                        {...register("dni", { required: true })} 
                        placeholder="12345678A" 
                      />
                      {errors.dni && <p className="text-xs text-destructive">El DNI es obligatorio</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        {...register("phone")} 
                        placeholder="666123456" 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register("email")} 
                        placeholder="alumno@email.com" 
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddStudentModal(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Añadir alumno</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Students table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Lista de alumnos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={filteredStudents.length > 0 && filteredStudents.filter(s => !originalStudentIds.includes(s.id)).every(s => selectedStudents.includes(s.id))} 
                          onCheckedChange={handleSelectAllStudents}
                          disabled={filteredStudents.filter(s => !originalStudentIds.includes(s.id)).length === 0}
                        />
                      </TableHead>
                      <TableHead>Alumno</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Teléfono</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id} className={originalStudentIds.includes(student.id) ? "bg-muted/30" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedStudents.includes(student.id)} 
                            onCheckedChange={() => handleSelectStudent(student.id)}
                            disabled={originalStudentIds.includes(student.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground flex items-center gap-2">
                                {student.name} {student.firstName} {student.lastName}
                                {originalStudentIds.includes(student.id) && (
                                  <Badge variant="secondary" className="text-xs">Ya inscrito</Badge>
                                )}
                              </p>
                              {student.email && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{student.email}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.dni}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron alumnos que coincidan con la búsqueda
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Form - Below students list */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fechas de la acción formativa</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start date */}
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Fecha de inicio</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: es })
                                  ) : (
                                    <span>Selecciona una fecha</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date && isValidStartDate(date)) {
                                    field.onChange(date);
                                  }
                                }}
                                disabled={(date) => !isValidStartDate(date)}
                                initialFocus
                                className="pointer-events-auto"
                                modifiers={{
                                  availableThursday: (date) => isThursday(date) && isValidStartDate(date)
                                }}
                                modifiersClassNames={{
                                  availableThursday: "bg-primary/10 text-primary font-medium hover:bg-primary/20 border border-primary/20"
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Weekly dedication */}
                    <FormField
                      control={form.control}
                      name="weeklyDedication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dedicación semanal (horas)</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2">2 horas/semana</SelectItem>
                                <SelectItem value="3">3 horas/semana</SelectItem>
                                <SelectItem value="4">4 horas/semana</SelectItem>
                                <SelectItem value="5">5 horas/semana</SelectItem>
                                <SelectItem value="6">6 horas/semana</SelectItem>
                                <SelectItem value="8">8 horas/semana</SelectItem>
                                <SelectItem value="10">10 horas/semana</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {watchedStartDate && watchedWeeklyDedication && (
                            <p className="text-sm text-muted-foreground">
                              Finalizará el <strong>{format(calculateEndDate(watchedStartDate, watchedWeeklyDedication), "PPP", { locale: es })}</strong>
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button type="submit" disabled={selectedStudents.length === 0} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar cambios
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => navigate(`/action/${action?.id || 1}`)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
