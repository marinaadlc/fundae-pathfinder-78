import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Search, Clock, BookOpen, Star, Info, X, CreditCard, Users, UserPlus, CalendarIcon, User, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format, addDays, isThursday, startOfDay, isBefore, addWeeks, addBusinessDays } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
interface Formation {
  id: number;
  name: string;
  category: string;
  courses: number;
  duration: string;
  isPopular?: boolean;
  description?: string;
  subFormations?: Array<{
    name: string;
    category: string;
    duration: string;
    rating: number;
    description: string;
    credits: number;
  }>;
}
interface Student {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  email: string;
  isSelected?: boolean;
}
const mockFormations: Formation[] = [{
  id: 1,
  name: "Automatización en Excel con VBA",
  category: "Ofimática",
  courses: 2,
  duration: "10 h. 18 min.",
  isPopular: true,
  description: "Aprende a automatizar tareas en Excel usando VBA para mejorar tu productividad y eficiencia en el trabajo.",
  subFormations: [{
    name: "Fundamentos de VBA en Excel",
    category: "Ofimática",
    duration: "4 h. 30 min.",
    rating: 4.7,
    description: "Aprende los conceptos básicos de VBA para automatizar tareas simples en Excel.",
    credits: 3
  }, {
    name: "Automatización avanzada con VBA",
    category: "Ofimática",
    duration: "5 h. 48 min.",
    rating: 4.8,
    description: "Desarrolla macros complejas y automatiza procesos avanzados en Excel.",
    credits: 4
  }]
}, {
  id: 2,
  name: "Blockchain: Fundamentos y Aplicaciones Prácticas",
  category: "Blockchain",
  courses: 3,
  duration: "5 h. 18 min.",
  description: "Descubre la tecnología blockchain desde sus fundamentos hasta aplicaciones prácticas en el mundo real.",
  subFormations: [{
    name: "Introducción a Blockchain",
    category: "Blockchain",
    duration: "1 h. 45 min.",
    rating: 4.6,
    description: "Comprende los fundamentos de la tecnología blockchain y sus aplicaciones.",
    credits: 2
  }, {
    name: "Criptomonedas y Bitcoin",
    category: "Blockchain",
    duration: "2 h. 15 min.",
    rating: 4.5,
    description: "Aprende sobre criptomonedas, Bitcoin y el ecosistema financiero digital.",
    credits: 3
  }, {
    name: "Smart Contracts con Ethereum",
    category: "Blockchain",
    duration: "1 h. 18 min.",
    rating: 4.7,
    description: "Desarrolla contratos inteligentes en la plataforma Ethereum.",
    credits: 2
  }]
}, {
  id: 3,
  name: "Certificación Cisco CCNA 200-301",
  category: "Ciberseguridad",
  courses: 12,
  duration: "6 h. 18 min.",
  description: "Prepárate para obtener la certificación CCNA de Cisco y convertirte en un experto en redes.",
  subFormations: [{
    name: "Fundamentos de Redes",
    category: "Ciberseguridad",
    duration: "2 h. 30 min.",
    rating: 4.8,
    description: "Domina los conceptos fundamentales de redes y protocolos de comunicación.",
    credits: 3
  }, {
    name: "Routing y Switching",
    category: "Ciberseguridad",
    duration: "2 h. 45 min.",
    rating: 4.7,
    description: "Aprende a configurar routers y switches para optimizar el tráfico de red.",
    credits: 4
  }, {
    name: "Seguridad de Redes",
    category: "Ciberseguridad",
    duration: "1 h. 03 min.",
    rating: 4.9,
    description: "Implementa medidas de seguridad avanzadas para proteger redes corporativas.",
    credits: 2
  }]
}, {
  id: 4,
  name: "Fundamentos de la Inteligencia Artificial",
  category: "IA",
  courses: 12,
  duration: "12 h. 18 min.",
  description: "La Inteligencia Artificial ya no es cosa del futuro, es el ahora. Si quieres comenzar a adentrarte en este increíble mundo, este curso te permitirá comenzar a aprender los fundamentos de la IA, hasta cómo hacerla parte de tus proyectos con Python, todo de manera clara y amena.",
  subFormations: [{
    name: "Fundamentos de la Inteligencia Artificial",
    category: "Ofimática",
    duration: "1 h. 18 min.",
    rating: 4.9,
    description: "Introduce los conceptos básicos de la inteligencia artificial y sus aplicaciones.",
    credits: 2
  }, {
    name: "Curso para no programadores: Uso básico de asistentes y GPTs en OpenAI",
    category: "Ofimática",
    duration: "1 h. 18 min.",
    rating: 4.9,
    description: "Aprende a utilizar ChatGPT y otros asistentes de IA sin conocimientos de programación.",
    credits: 2
  }, {
    name: "Dominando ChatGPT con la API de OpenAI",
    category: "IA",
    duration: "2 h. 30 min.",
    rating: 4.8,
    description: "Integra la API de OpenAI en tus proyectos y domina las capacidades avanzadas de ChatGPT.",
    credits: 3
  }]
}];

// Mock students data
const mockStudents: Student[] = [{
  id: 1,
  name: "Ana",
  firstName: "García",
  lastName: "López",
  dni: "12345678A",
  phone: "666123456",
  email: "ana.garcia@email.com"
}, {
  id: 2,
  name: "Carlos",
  firstName: "Rodríguez",
  lastName: "Martín",
  dni: "87654321B",
  phone: "666234567",
  email: "carlos.rodriguez@email.com"
}, {
  id: 3,
  name: "María",
  firstName: "Fernández",
  lastName: "Sánchez",
  dni: "11223344C",
  phone: "666345678",
  email: "maria.fernandez@email.com"
}, {
  id: 4,
  name: "David",
  firstName: "López",
  lastName: "González",
  dni: "44332211D",
  phone: "666456789",
  email: "david.lopez@email.com"
}, {
  id: 5,
  name: "Laura",
  firstName: "Martínez",
  lastName: "Ruiz",
  dni: "55667788E",
  phone: "666567890",
  email: "laura.martinez@email.com"
}];
const CreateAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preselectedFormationId = searchParams.get('formationId');
  const isCustomFormation = searchParams.get('customFormation');
  const initialStep = searchParams.get('step') ? parseInt(searchParams.get('step')!) : 1;
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Handle custom formation from sessionStorage
  const getInitialFormation = () => {
    if (isCustomFormation) {
      const customFormationData = sessionStorage.getItem('customFormation');
      if (customFormationData) {
        return JSON.parse(customFormationData);
      }
    }
    return preselectedFormationId ? mockFormations.find(f => f.id === parseInt(preselectedFormationId)) || null : null;
  };
  
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(getInitialFormation());
  const [hoveredFormation, setHoveredFormation] = useState<Formation | null>(null);
  const [selectedFormationDetail, setSelectedFormationDetail] = useState<Formation | null>(null);
  const [showMinHoursAlert, setShowMinHoursAlert] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  // Step 2 states
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  // Step 3 states
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  // Form for adding individual student
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors
    }
  } = useForm<{
    name: string;
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
  }>();
  const categories = ["Ofimática", "Blockchain", "Ciberseguridad", "IA"];
  const filteredFormations = mockFormations.filter(formation => {
    const matchesSearch = formation.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || formation.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleSelectFormation = (formation: Formation) => {
    if (selectedFormation?.id === formation.id) {
      setSelectedFormation(null);
    } else {
      setSelectedFormation(formation);
    }
  };
  const isFormationSelected = (formation: Formation) => {
    return selectedFormation?.id === formation.id;
  };
  const handleSelectStudent = (studentId: number) => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };
  const handleSelectAllStudents = () => {
    const filteredStudentIds = filteredStudents.map(s => s.id);
    if (selectedStudents.length === filteredStudentIds.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudentIds);
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
      toast({
        title: "Error en los datos",
        description: "Los campos nombre, apellidos y DNI son obligatorios",
        variant: "destructive"
      });
      return;
    }

    // Check if DNI already exists
    if (students.some(student => student.dni === data.dni)) {
      toast({
        title: "Error en los datos",
        description: "Ya existe un alumno con ese DNI",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      toast({
        title: "Error en los datos",
        description: "El formato del email no es correcto",
        variant: "destructive"
      });
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
    toast({
      title: "Alumno añadido",
      description: `${newStudent.name} ${newStudent.firstName} ha sido añadido correctamente`
    });
    reset();
    setShowAddStudentModal(false);
  };
  const filteredStudents = students.filter(student => student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || student.firstName.toLowerCase().includes(studentSearchTerm.toLowerCase()) || student.lastName.toLowerCase().includes(studentSearchTerm.toLowerCase()) || student.dni.toLowerCase().includes(studentSearchTerm.toLowerCase()));

  // Calculate formation credits and minimum students required
  const getFormationCredits = () => {
    if (!selectedFormation?.subFormations) return 0;
    return selectedFormation.subFormations.reduce((total, sub) => total + sub.credits, 0);
  };
  const getFormationHours = () => {
    if (!selectedFormation) return 0;
    return parseFloat(selectedFormation.duration.split(' ')[0]);
  };
  const getMinimumStudentsRequired = () => {
    const formationHours = getFormationHours();
    if (formationHours >= 18) return 1;
    return Math.ceil(18 / formationHours);
  };
  const getTotalCreditsConsumption = () => {
    return getFormationCredits() * selectedStudents.length;
  };
  const canProceedToNextStep = () => {
    return selectedStudents.length >= getMinimumStudentsRequired();
  };

  // Step 3 helper functions
  const getMinThursday = () => {
    const today = new Date();
    // Añadir 4 días laborables (no incluye fines de semana)
    const minDate = addBusinessDays(today, 4);

    // Encontrar el próximo jueves desde la fecha mínima
    let nextThursday = minDate;
    while (!isThursday(nextThursday)) {
      nextThursday = addDays(nextThursday, 1);
    }
    return nextThursday;
  };
  const calculateEndDate = (start: Date) => {
    const totalHours = getFormationHours();
    const weeksNeeded = Math.ceil(totalHours / 3); // 1 week per 3 hours
    return addWeeks(start, weeksNeeded);
  };
  const isValidStartDate = (date: Date) => {
    const minDate = addBusinessDays(new Date(), 4);
    return isThursday(date) && !isBefore(date, minDate);
  };
  const handleStartDateChange = (date: Date | undefined) => {
    if (date && isValidStartDate(date)) {
      setStartDate(date);
      setEndDate(calculateEndDate(date));
    } else if (date) {
      toast({
        title: "Fecha no válida",
        description: "La fecha de inicio debe ser un jueves con al menos 4 días de antelación",
        variant: "destructive"
      });
    }
  };
  const handleConfirmAction = () => {
    // Create new action and save to localStorage
    const newAction = {
      id: Date.now(),
      // Simple ID generation
      name: selectedFormation?.name || "",
      students: selectedStudents.length,
      creationDate: format(new Date(), "dd/MM/yyyy"),
      startDate: format(startDate!, "dd/MM/yyyy"),
      status: "solicited" as const
    };
    const existingActions = JSON.parse(localStorage.getItem('formativeActions') || '[]');
    const updatedActions = [newAction, ...existingActions];
    localStorage.setItem('formativeActions', JSON.stringify(updatedActions));
    setShowConfirmationDialog(false);
    toast({
      title: "Solicitud enviada",
      description: "Se ha enviado la solicitud de la acción formativa. Recibirás un email en cuanto esté todo revisado y quede programada."
    });

    // Navigate to formative actions page
    navigate("/");
  };
  const getSelectedStudentsData = () => {
    return students.filter(student => selectedStudents.includes(student.id));
  };
  const steps = [{
    number: 1,
    title: "Selecciona las formaciones que se realizarán",
    active: currentStep === 1
  }, {
    number: 2,
    title: "Elige los alumnos que participarán",
    active: currentStep === 2
  }, {
    number: 3,
    title: "Establece las fechas de la acción formativa",
    active: currentStep === 3
  }];
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-6">Nueva acción formativa</h1>
        
        {/* Steps */}
        <div className="flex items-center space-x-8 mb-8">
          {steps.map((stepItem, index) => <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${stepItem.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {stepItem.number}
              </div>
              <span className={`ml-3 text-sm font-medium ${stepItem.active ? "text-primary" : "text-muted-foreground"}`}>
                {stepItem.title}
              </span>
              {index < steps.length - 1 && <div className="w-8 h-px bg-border ml-4" />}
            </div>)}
        </div>
      </div>

      {/* Step 1 Content */}
      {currentStep === 1 && <>
         

         {/* Filters */}
         <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Formaciones disponibles</h2>
              </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1">
             

              <div className="space-y-4">
                {filteredFormations.map(formation => <Card key={formation.id} className={`relative transition-all duration-300 cursor-pointer hover:shadow-lg overflow-hidden group ${isFormationSelected(formation) ? "bg-primary/10 border-primary shadow-lg" : ""} ${selectedFormationDetail?.id === formation.id ? "bg-accent/50 shadow-lg" : ""}`} onMouseEnter={() => setHoveredFormation(formation)} onMouseLeave={() => setHoveredFormation(null)} onClick={() => handleSelectFormation(formation)}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground">{formation.name}</h3>
                            {formation.isPopular && <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-orange-500 fill-current" />
                                <span className="text-sm text-orange-600 font-medium">Popular</span>
                              </div>}
                          </div>
                          {isFormationSelected(formation) && parseFloat(formation.duration.split(' ')[0]) < 18 && (
                            <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 p-2 rounded-md mb-2">
                              <Info className="h-4 w-4" />
                              Necesitarás que al menos {getMinimumStudentsRequired()} personas realicen esta acción formativa para alcanzar el mínimo de horas requerido.
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{formation.category}</Badge>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CreditCard className="h-4 w-4" />
                              <span>{formation.subFormations?.reduce((total, sub) => total + sub.credits, 0) || 0} créditos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formation.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-end">
                      <div className="flex items-center gap-3 p-6">
                        {isFormationSelected(formation) ? <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFormation(formation);
                          }} className="bg-white text-slate-900 hover:bg-gray-100">
                            Seleccionada
                          </Button> : <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            handleSelectFormation(formation);
                          }} className="bg-white text-slate-900 hover:bg-gray-100">
                            Seleccionar
                          </Button>}
                        
                        <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            if (selectedFormationDetail?.id !== formation.id) {
                              setSelectedFormationDetail(formation);
                            }
                          }} className="border-white text-black bg-white hover:bg-gray-100 hover:text-black">
                          Ver los cursos
                        </Button>
                      </div>
                    </div>
                  </Card>)}

                {/* Custom Formation Card */}
                <Card className="transition-all duration-200 cursor-pointer hover:shadow-lg border-dashed border-2 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300 hover:from-teal-100 hover:to-cyan-100 hover:border-teal-400" onClick={() => navigate('/custom-formation')}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-teal-900">Formación personalizada</h3>
                          <Badge variant="outline" className="border-teal-500 text-teal-700 bg-teal-100">✨ Personalizable</Badge>
                        </div>
                        <p className="text-sm text-teal-800">
                          Crea tu propio itinerario formativo con IA que se adapte a tus necesidades específicas.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" className="border-teal-500 text-teal-700 hover:bg-teal-100" onClick={(e) => {
                          e.stopPropagation();
                          navigate('/custom-formation');
                        }}>
                          Crear formación
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                Total de 456 resultados.
              </div>
            </div>

            {/* Side panel - Formations details */}
            {selectedFormationDetail && selectedFormationDetail.subFormations && <div className="w-96">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Cursos que incluye</h3>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedFormationDetail(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">                  
                      {selectedFormationDetail.subFormations?.map((subFormation, index) => <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">{subFormation.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{subFormation.description}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary" className="text-xs">{subFormation.category}</Badge>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{subFormation.duration}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3" />
                                <span>{subFormation.credits} créditos</span>
                              </div>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
              </div>}
          </div>
        </>}

      {/* Step 2 Content - Students Selection */}
      {currentStep === 2 && <>
          <div className="space-y-6">
            {/* Header with selected formation info and credits */}
            {selectedFormation && <Card className="bg-accent/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{selectedFormation.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <Badge variant="secondary">{selectedFormation.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedFormation.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {getFormationCredits()} créditos por alumno
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">
                        {getTotalCreditsConsumption()} créditos totales
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getFormationCredits()} × {selectedStudents.length} alumnos
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>}

            {/* Actions and search */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Buscar alumnos..." value={studentSearchTerm} onChange={e => setStudentSearchTerm(e.target.value)} className="pl-10 w-80" />
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
                  <form onSubmit={handleSubmit(addIndividualStudent)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre *</Label>
                      <Input id="name" {...register("name", {
                    required: true
                  })} placeholder="Nombre del alumno" />
                      {errors.name && <p className="text-xs text-destructive">El nombre es obligatorio</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Primer apellido *</Label>
                        <Input id="firstName" {...register("firstName", {
                      required: true
                    })} placeholder="Primer apellido" />
                        {errors.firstName && <p className="text-xs text-destructive">Campo obligatorio</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Segundo apellido</Label>
                        <Input id="lastName" {...register("lastName")} placeholder="Segundo apellido" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dni">DNI *</Label>
                      <Input id="dni" {...register("dni", {
                    required: true
                  })} placeholder="12345678A" />
                      {errors.dni && <p className="text-xs text-destructive">El DNI es obligatorio</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" {...register("phone")} placeholder="666123456" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} placeholder="alumno@email.com" />
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setShowAddStudentModal(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        Añadir alumno
                      </Button>
                    </DialogFooter>
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
                        <Checkbox checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onCheckedChange={handleSelectAllStudents} />
                      </TableHead>
                      <TableHead>Alumno</TableHead>
                      <TableHead>DNI</TableHead>
                      <TableHead>Teléfono</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => <TableRow key={student.id}>
                        <TableCell>
                          <Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={() => handleSelectStudent(student.id)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{student.name} {student.firstName} {student.lastName}</p>
                              {student.email && <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{student.email}</span>
                                </div>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{student.dni}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                      </TableRow>)}
                  </TableBody>
                </Table>
                
                {filteredStudents.length === 0 && <div className="text-center py-8 text-muted-foreground">
                    No se encontraron alumnos que coincidan con la búsqueda
                  </div>}
              </CardContent>
            </Card>
          </div>
        </>}

      {/* Step 3 Content */}
      {currentStep === 3 && <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Fechas de la acción formativa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resumen de la acción formativa */}
              <div className="p-6 bg-accent/50 from-primary to-primary/80 rounded-lg text-primary-foreground">
                <h1 className="text-xl font-bold mb-4 text-zinc-900">{selectedFormation?.name}</h1>
                <div className="flex items-center gap-6">
                  <Badge variant="secondary" className="text-primary-foreground border-primary-foreground/30 bg-zinc-300">
                    {selectedFormation?.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 bg-zinc-50" />
                    <span className="text-zinc-500">{selectedFormation?.duration}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Fecha de inicio */}
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-sm font-medium">Fecha de inicio *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP", {
                      locale: es
                    }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={handleStartDateChange} disabled={date => !isValidStartDate(date)} initialFocus className="pointer-events-auto" modifiers={{
                    availableThursday: date => isThursday(date) && isValidStartDate(date)
                  }} modifiersClassNames={{
                    availableThursday: "bg-primary/10 text-primary font-medium hover:bg-primary/20 border border-primary/20"
                  }} />
                    </PopoverContent>
                  </Popover>
                  <p className="text-sm text-muted-foreground">
                    Selecciona una de las fechas disponibles
                  </p>
                </div>

                {/* Fecha de fin */}
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm font-medium">Fecha de fin</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {endDate ? format(endDate, "PPP", { locale: es }) : "Selecciona una fecha de inicio"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Se calcula automáticamente: 1 semana por cada 3 horas de formación
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>
        </>}

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 border-t">
        {currentStep > 1 && <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
            Anterior
          </Button>}
        
        <div className="flex items-center gap-4 ml-auto">
          {/* Minimum requirements alert inline with button */}
          {currentStep === 2 && getFormationHours() < 18 && selectedStudents.length < getMinimumStudentsRequired() && <Alert className="border-primary bg-background">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                <div className="text-sm text-foreground">
                  <div className="font-medium">Requisitos mínimos no cumplidos</div>
                  <div className="text-muted-foreground">
                    Necesitas seleccionar al menos {getMinimumStudentsRequired()} alumnos para alcanzar el mínimo de 18 horas de formación. Faltan {getMinimumStudentsRequired() - selectedStudents.length} alumnos más.
                  </div>
                </div>
              </AlertDescription>
            </Alert>}

          {currentStep === 1 && <Button className="px-8" disabled={!selectedFormation} onClick={() => setCurrentStep(2)}>
              Siguiente
            </Button>}
          {currentStep === 2 && <Button className="px-8" disabled={!canProceedToNextStep()} onClick={() => setCurrentStep(3)}>
              Siguiente
            </Button>}
          {currentStep === 3 && <Button className="px-8" disabled={!startDate} onClick={() => setShowConfirmationDialog(true)}>
              Revisar y crear la acción
            </Button>}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar acción formativa</DialogTitle>
            <DialogDescription>
              Revisa los datos de la acción formativa antes de enviar la solicitud
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Nombre de la acción */}
            <div>
              <h3 className="font-semibold mb-2">Nombre de la acción</h3>
              <p className="text-muted-foreground">{selectedFormation?.name}</p>
            </div>

            {/* Duración */}
            <div>
              <h3 className="font-semibold mb-2">Duración de la formación</h3>
              <p className="text-muted-foreground">{selectedFormation?.duration}</p>
            </div>

            {/* Alumnos */}
            <div>
              <h3 className="font-semibold mb-2">Alumnos ({getSelectedStudentsData().length})</h3>
              <div className="max-h-32 overflow-y-auto border rounded-lg p-3 bg-muted/30">
                <div className="space-y-1">
                  {getSelectedStudentsData().map((student, index) => <div key={student.id} className="text-sm text-muted-foreground">
                      {index + 1}. {student.name} {student.firstName} {student.lastName}
                    </div>)}
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Fecha de inicio</h3>
                <p className="text-muted-foreground">
                  {startDate ? format(startDate, "PPP", {
                  locale: es
                }) : "No seleccionada"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fecha de fin</h3>
                <p className="text-muted-foreground">
                  {endDate ? format(endDate, "PPP", {
                  locale: es
                }) : "No calculada"}
                </p>
              </div>
            </div>

            {/* Créditos */}
            <div>
              <h3 className="font-semibold mb-2">Créditos que se consumirán</h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-primary">{getTotalCreditsConsumption()}</span>
                <span className="text-muted-foreground">
                  ({getFormationCredits()} créditos × {selectedStudents.length} alumnos)
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirmationDialog(false)}>
              Volver atrás
            </Button>
            <Button onClick={handleConfirmAction}>
              Confirmar y enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default CreateAction;