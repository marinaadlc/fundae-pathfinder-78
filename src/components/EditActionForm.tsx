import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
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
import { CalendarIcon, Edit3, Users, CreditCard, Search, UserPlus, User, Mail, Clock } from "lucide-react";
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

interface EditActionFormProps {
  action: {
    id: number;
    name: string;
    startDate: string;
    weeklyDedication: number;
    students: Array<{ id: number; name: string }>;
    duration?: string; // Total duration of the formation
  };
  onSave: (data: { studentsCount: number; startDate: Date; weeklyDedication: number; selectedStudents: number[] }) => void;
  disabled?: boolean;
  disabledReason?: string;
}

// Mock students data - same as in CreateAction
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

export function EditActionForm({ action, onSave, disabled, disabledReason }: EditActionFormProps) {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState<number[]>(
    action.students.map(s => s.id)
  );
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Get the IDs of students that were originally in the action (cannot be removed)
  const originalStudentIds = action.students.map(s => s.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: new Date(action.startDate),
      weeklyDedication: action.weeklyDedication,
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

  // Helper functions
  const getFormationHours = () => {
    if (!action.duration) return 20; // Default hours if no duration
    return parseFloat(action.duration.split(' ')[0]);
  };

  const getCreditsPerStudent = () => {
    // Assuming 1 credit per 3 hours (this would need to be adjusted based on actual formation data)
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
    return action.students.length * getCreditsPerStudent();
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
    onSave({
      studentsCount: selectedStudents.length,
      startDate: values.startDate,
      weeklyDedication: values.weeklyDedication,
      selectedStudents: selectedStudents,
    });
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            disabled={disabled}
            className="flex items-center gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit3 className="h-4 w-4" />
            Editar acción
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar acción formativa</DialogTitle>
            <DialogDescription>
              Modifica los alumnos, fechas y dedicación de la acción formativa
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Action info - Sticky with white fill above */}
            <div className="sticky top-0 z-20 bg-background pt-4 border-b pb-4">
              <Card className="bg-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{action.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {action.duration || "20 h. 00 min."}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {getCreditsPerStudent()} créditos por alumno
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">
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

            {/* Students selection */}
            <div className="space-y-4">
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

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
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

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={selectedStudents.length === 0}>
                    Guardar cambios
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}