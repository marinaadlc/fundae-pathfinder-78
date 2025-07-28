import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
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

  // Form fields
  const [trainingFocus, setTrainingFocus] = useState("");
  const [teamRole, setTeamRole] = useState("");

  // Load parameters from smart selector if available
  useEffect(() => {
    const savedParams = sessionStorage.getItem('customFormationParams');
    if (savedParams) {
      try {
        const params = JSON.parse(savedParams);
        setTrainingFocus(params.trainingFocus || "");
        setTeamRole(params.teamRole || "");

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
    if (!trainingFocus.trim() || !teamRole.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);

    // Simulate AI API call
    setTimeout(() => {
      // Extract key information from training focus
      const firstSkill = trainingFocus.split(/[,.]|\s+y\s+|\s+e\s+/)[0]?.trim() || "la competencia";

      // Generate courses to meet minimum 18 hours
      const mockCourses: Course[] = [{
        id: 1,
        name: "Fundamentos de " + firstSkill,
        category: "Fundamentos",
        duration: "6 h. 00 min.",
        description: `Conceptos básicos y fundamentos de ${firstSkill} para ${teamRole}`,
        credits: 6,
        rating: 4.6
      }, {
        id: 2,
        name: "Aplicación práctica",
        category: "Práctica",
        duration: "8 h. 00 min.",
        description: `Ejercicios prácticos específicos para ${teamRole} en ${firstSkill}`,
        credits: 8,
        rating: 4.7
      }, {
        id: 3,
        name: "Herramientas avanzadas",
        category: "Avanzado",
        duration: "4 h. 30 min.",
        description: `Herramientas y técnicas avanzadas para optimizar el trabajo de ${teamRole} en ${firstSkill}`,
        credits: 4,
        rating: 4.8
      }];
      const totalCredits = mockCourses.reduce((sum, course) => sum + course.credits, 0);
      const totalHours = mockCourses.reduce((sum, course) => {
        const hours = parseFloat(course.duration.split(' ')[0]) + (parseFloat(course.duration.split(' ')[2]) || 0) / 60;
        return sum + hours;
      }, 0);
      setCustomFormation({
        name: `${firstSkill} para ${teamRole}`,
        category: "Personalizada",
        courses: mockCourses,
        totalDuration: `${Math.floor(totalHours)} h. ${Math.round(totalHours % 1 * 60)} min.`,
        totalCredits
      });
      setIsGenerating(false);
    }, 2000);
  };
  const removeCourse = (courseId: number) => {
    if (!customFormation) return;
    const updatedCourses = customFormation.courses.filter(course => course.id !== courseId);
    const totalCredits = updatedCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalHours = updatedCourses.reduce((sum, course) => {
      const hours = parseFloat(course.duration.split(' ')[0]) + (parseFloat(course.duration.split(' ')[2]) || 0) / 60;
      return sum + hours;
    }, 0);

    // Calculate students needed if formation is below 18 hours
    if (totalHours < 18) {
      const studentsNeeded = Math.ceil(18 / totalHours);
      toast({
        title: "Formación por debajo del mínimo",
        description: `Necesitarás que ${studentsNeeded} alumnos realicen esta formación para alcanzar el mínimo de horas requerido`,
        variant: "destructive"
      });
    }
    setCustomFormation({
      ...customFormation,
      courses: updatedCourses,
      totalDuration: `${Math.floor(totalHours)} h. ${Math.round(totalHours % 1 * 60)} min.`,
      totalCredits
    });
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
      description: `Formación personalizada creada según especificaciones detalladas`,
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
                <Label htmlFor="training-focus">En qué quieres formar a tus equipos *</Label>
                <Textarea id="training-focus" placeholder="Ej: 'Excel avanzado', 'Liderazgo de equipos'" value={trainingFocus} onChange={e => setTrainingFocus(e.target.value)} rows={4} className="resize-none" />
              </div>

              <div>
                <Label htmlFor="team-role">Rol de las personas*</Label>
                <Textarea id="team-role" placeholder="Ej: 'Analistas financieros con experiencia básica en Excel', 'Desarrolladores junior con conocimientos de JavaScript'" value={teamRole} onChange={e => setTeamRole(e.target.value)} rows={4} className="resize-none" />
              </div>

              <Button onClick={handleGenerateFormation} disabled={isGenerating || !trainingFocus.trim() || !teamRole.trim()} className="w-full" variant={customFormation ? "outline" : "default"}>
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
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Formación personalizada generada según las especificaciones proporcionadas
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
                  <span className="text-sm font-medium">Resumen:</span>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {customFormation.courses.length} cursos
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {customFormation.totalDuration}
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <BadgeCent className="h-3 w-3" />
                      {customFormation.totalCredits} créditos/alumno
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

    </div>;
};
export default CustomFormationCreator;