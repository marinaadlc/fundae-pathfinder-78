import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Sparkles, X, Clock, BookOpen, Star, Loader2, RefreshCw, BadgeCent } from "lucide-react";
interface Course {
  id: number;
  name: string;
  category: string;
  duration: string;
  description: string;
  credits: number;
  rating: number;
}
interface CustomFormation {
  name: string;
  category: string;
  courses: Course[];
  totalDuration: string;
  totalCredits: number;
}
const CustomFormationCreator = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customFormation, setCustomFormation] = useState<CustomFormation | null>(null);
  const [showMinHoursAlert, setShowMinHoursAlert] = useState(false);
  const [minHoursData, setMinHoursData] = useState<{
    currentHours: number;
    minHours: number;
    additionalStudents: number;
  } | null>(null);

  // Form fields
  const [numberOfStudents, setNumberOfStudents] = useState<number>(5);
  const [formationDetails, setFormationDetails] = useState("");

  // Load parameters from smart selector if available
  useEffect(() => {
    const savedParams = sessionStorage.getItem('customFormationParams');
    if (savedParams) {
      try {
        const params = JSON.parse(savedParams);
        setNumberOfStudents(parseInt(params.numberOfStudents) || 5);
        setFormationDetails(params.formationDetails || "");

        // Load generated formation if available
        if (params.generatedFormation) {
          setCustomFormation(params.generatedFormation);
        }

        // Clear the params after loading
        sessionStorage.removeItem('customFormationParams');
      } catch (error) {
        console.error('Error loading custom formation params:', error);
      }
    }
  }, []);
  const handleGenerateFormation = async () => {
    if (!formationDetails.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor, describe los detalles de la formación",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);

    // Simulate AI API call
    setTimeout(() => {
      // Extract key information from formation details
      const firstSkill = formationDetails.split(/[,.]|\s+y\s+|\s+e\s+/)[0]?.trim() || "la competencia";
      
      const mockCourses: Course[] = [{
        id: 1,
        name: "Fundamentos de " + firstSkill,
        category: "Fundamentos",
        duration: "3 h. 30 min.",
        description: `Conceptos básicos y fundamentos de ${firstSkill} basados en los requerimientos especificados`,
        credits: 3,
        rating: 4.6
      }, {
        id: 2,
        name: "Aplicación práctica",
        category: "Práctica",
        duration: "4 h. 45 min.",
        description: `Ejercicios prácticos y casos de uso específicos según los detalles proporcionados`,
        credits: 4,
        rating: 4.7
      }, {
        id: 3,
        name: "Herramientas avanzadas",
        category: "Avanzado",
        duration: "2 h. 15 min.",
        description: `Herramientas y técnicas avanzadas para optimizar el trabajo en ${firstSkill}`,
        credits: 2,
        rating: 4.8
      }];
      const totalCredits = mockCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalHours = mockCourses.reduce((sum, course) => {
        const hours = parseFloat(course.duration.split(' ')[0]);
        return sum + hours;
      }, 0);
      setCustomFormation({
        name: `Formación personalizada: ${firstSkill}`,
        category: "Personalizada",
        courses: mockCourses,
        totalDuration: `${Math.floor(totalHours)} h. ${Math.round(totalHours % 1 * 60)} min.`,
        totalCredits
      });
      setIsGenerating(false);
    }, 2000);
  };
  // Calculate minimum hours required based on number of students
  const getMinHoursRequired = (students: number) => {
    // Minimum hours: 8 hours for 1-5 students, 12 hours for 6-10, 16 hours for 11-15, etc.
    if (students <= 5) return 8;
    if (students <= 10) return 12;
    if (students <= 15) return 16;
    if (students <= 20) return 20;
    return 24;
  };

  const removeCourse = (courseId: number) => {
    if (!customFormation) return;
    const updatedCourses = customFormation.courses.filter(course => course.id !== courseId);
    const totalCredits = updatedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalHours = updatedCourses.reduce((sum, course) => {
      const hours = parseFloat(course.duration.split(' ')[0]);
      return sum + hours;
    }, 0);

    const minHoursRequired = getMinHoursRequired(numberOfStudents);
    
    // Check if removing this course would make the formation too short
    if (totalHours < minHoursRequired) {
      // Calculate how many fewer students would be needed
      let additionalStudents = 0;
      let testStudents = numberOfStudents - 1;
      while (testStudents > 0 && getMinHoursRequired(testStudents) > totalHours) {
        additionalStudents++;
        testStudents--;
      }
      
      setMinHoursData({
        currentHours: totalHours,
        minHours: minHoursRequired,
        additionalStudents: additionalStudents
      });
      setShowMinHoursAlert(true);
      return;
    }

    setCustomFormation({
      ...customFormation,
      courses: updatedCourses,
      totalDuration: `${Math.floor(totalHours)} h. ${Math.round(totalHours % 1 * 60)} min.`,
      totalCredits
    });
  };

  const handleRegenerateFormation = () => {
    setShowMinHoursAlert(false);
    handleGenerateFormation();
  };
  const handleContinue = () => {
    if (!customFormation || customFormation.courses.length === 0) {
      toast({
        title: "Formación incompleta",
        description: "Debe mantener al menos un curso en la formación",
        variant: "destructive"
      });
      return;
    }

    // Store the custom formation in sessionStorage to pass it to the next step
    const formationData = {
      id: Date.now(),
      name: customFormation.name,
      category: customFormation.category,
      courses: customFormation.courses.length,
      duration: customFormation.totalDuration,
      description: `Formación personalizada creada para ${numberOfStudents} alumnos según especificaciones detalladas`,
      subFormations: customFormation.courses.map(course => ({
        name: course.name,
        category: course.category,
        duration: course.duration,
        rating: course.rating,
        description: course.description,
        credits: course.credits
      }))
    };
    sessionStorage.setItem('customFormation', JSON.stringify(formationData));

    // Navigate to create action with the custom formation
    navigate(`/create-action?step=2&customFormation=true`);
  };
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Crear formación personalizada</h1>
        <p className="text-muted-foreground">
          Describe los requisitos de tu formación y nuestra IA creará un plan personalizado
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center space-x-8 mb-8">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            1
          </div>
          <span className="ml-3 text-sm font-medium text-primary">
            Crear formación personalizada
          </span>
          <div className="w-8 h-px bg-border ml-4" />
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
            2
          </div>
          <span className="ml-3 text-sm font-medium text-muted-foreground">
            Elige los alumnos que participarán
          </span>
          <div className="w-8 h-px bg-border ml-4" />
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-sm font-medium">
            3
          </div>
          <span className="ml-3 text-sm font-medium text-muted-foreground">
            Establece las fechas de la acción formativa
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - Form */}
        <div className="space-y-6">
          <Card className="bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Parámetros de la formación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="students">Número de alumnos</Label>
                <Input id="students" type="number" min="1" max="50" value={numberOfStudents} onChange={e => setNumberOfStudents(parseInt(e.target.value) || 1)} />
              </div>

              <div>
                <Label htmlFor="formation-details">Detalles de la formación *</Label>
                <Textarea 
                  id="formation-details" 
                  placeholder="Describe el rol y las necesidades formativas de las personas que quieres formar.
            Ej:'Formación en Excel avanzado para analistas financieros con experiencia básica. Necesitan aprender macros, tablas dinámicas y análisis de datos para reportes mensuales.'"
                  value={formationDetails} 
                  onChange={e => setFormationDetails(e.target.value)} 
                  rows={8}
                  className="resize-none"
                />
              </div>

              <Button onClick={handleGenerateFormation} disabled={isGenerating || !formationDetails.trim()} className="w-full" variant={customFormation ? "outline" : "default"}>
                {isGenerating ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {customFormation ? "Regenerando formación..." : "Generando formación..."}
                  </> : customFormation ? <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerar
                  </> : <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generar formación personalizada
                  </>}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Generated formation */}
        <div className="space-y-6">
          {customFormation ? <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{customFormation.name}</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Personalizada
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {customFormation.courses.length} cursos
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {customFormation.totalDuration}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Formación generada para {numberOfStudents} alumnos según los detalles especificados
                </p>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Cursos incluidos:</Label>
                  {customFormation.courses.map(course => <div key={course.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{course.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{course.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {course.rating}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {course.credits} créditos
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeCourse(course.id)} className="ml-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>)}
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Total:</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{customFormation.totalDuration}</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <BadgeCent className="h-3 w-3" />
                      {customFormation.totalCredits * numberOfStudents} créditos total ({customFormation.totalCredits} × {numberOfStudents} alumnos)
                    </Badge>
                  </div>
                </div>

                <Button onClick={handleContinue} className="w-full" disabled={customFormation.courses.length === 0}>
                  Crear acción formativa con esta formación
                </Button>
              </CardContent>
            </Card> : <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Completa los parámetros y genera tu formación personalizada</p>
              </div>
            </Card>}
        </div>
      </div>

      {/* Alert Dialog for minimum hours warning */}
      <AlertDialog open={showMinHoursAlert} onOpenChange={setShowMinHoursAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duración insuficiente</AlertDialogTitle>
            <AlertDialogDescription>
              La formación actual tiene {minHoursData?.currentHours || 0} horas, pero necesita al menos {minHoursData?.minHours || 0} horas para {numberOfStudents} alumnos.
              {minHoursData?.additionalStudents && minHoursData.additionalStudents > 0 && (
                <span className="block mt-2">
                  <strong>Alternativa:</strong> Podrías impartir esta formación a {numberOfStudents - minHoursData.additionalStudents} alumnos o menos.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRegenerateFormation}>
              Regenerar formación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default CustomFormationCreator;