import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, RefreshCw, BookOpen, Users, Clock, BadgeCent, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import avatar1 from "@/assets/avatar1.png";
import avatar2 from "@/assets/avatar2.png";
import avatar3 from "@/assets/avatar3.png";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  courses: number;
  level: string;
  students: number;
  isPopular?: boolean;
  credits: number;
}

interface SmartFormationSelectorProps {
  courses: Course[];
}

interface CustomFormation {
  title: string;
  description: string;
  category: string;
  duration: string;
  modules: string[];
  credits: number;
}

export const SmartFormationSelector = ({ courses }: SmartFormationSelectorProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [numStudents, setNumStudents] = useState("");
  const [formationDetails, setFormationDetails] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  const handleSmartFilter = () => {
    if (!formationDetails.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor completa los detalles de la formación",
        variant: "destructive",
      });
      return;
    }

    // Simulación de filtrado inteligente
    const filtered = courses.filter(course => {
      return course.description.toLowerCase().includes(formationDetails.toLowerCase()) ||
             course.title.toLowerCase().includes(formationDetails.toLowerCase());
    });

    setFilteredCourses(filtered);
    setIsActive(true);

    toast({
      title: "Filtrado completado",
      description: `Se encontraron ${filtered.length} formaciones que coinciden con tus criterios`,
    });
  };

  const handleCreateCustomFormation = () => {
    if (!formationDetails.trim()) {
      toast({
        title: "Campo requerido",
        description: "Por favor completa los detalles de la formación antes de crear una formación personalizada",
        variant: "destructive",
      });
      return;
    }

    // Generar las formaciones automáticamente basadas en los detalles
    const firstSkill = formationDetails.split(/[,.]|\s+y\s+|\s+e\s+/)[0]?.trim() || "la competencia";
    const mockCourses = [
      {
        id: 1,
        name: "Fundamentos de " + firstSkill,
        category: "Fundamentos",
        duration: "3 h. 30 min.",
        description: `Conceptos básicos y fundamentos de ${firstSkill} basados en los requerimientos especificados`,
        credits: 3,
        rating: 4.6
      },
      {
        id: 2,
        name: "Aplicación práctica",
        category: "Práctica",
        duration: "4 h. 45 min.",
        description: `Ejercicios prácticos y casos de uso específicos según los detalles proporcionados`,
        credits: 4,
        rating: 4.7
      },
      {
        id: 3,
        name: "Herramientas avanzadas",
        category: "Avanzado",
        duration: "2 h. 15 min.",
        description: `Herramientas y técnicas avanzadas para optimizar el trabajo en ${firstSkill}`,
        credits: 2,
        rating: 4.8
      }
    ];

    const totalCredits = mockCourses.reduce((sum, course) => sum + course.credits, 0);
    const totalHours = mockCourses.reduce((sum, course) => {
      const hours = parseFloat(course.duration.split(' ')[0]);
      return sum + hours;
    }, 0);

    const customFormation = {
      name: `Formación personalizada: ${firstSkill}`,
      category: "Personalizada",
      courses: mockCourses,
      totalDuration: `${Math.floor(totalHours)} h. ${Math.round((totalHours % 1) * 60)} min.`,
      totalCredits
    };

    // Guardar los parámetros y la formación generada en sessionStorage
    sessionStorage.setItem('customFormationParams', JSON.stringify({
      numberOfStudents: numStudents || "Sin especificar",
      formationDetails: formationDetails,
      level: "intermedio", // Nivel por defecto desde el selector inteligente
      generatedFormation: customFormation
    }));

    // Navegar a la página de custom formation
    navigate('/custom-formation');
  };

  const navigateToFormationDetail = (course: Course) => {
    navigate(`/course/${course.id}`);
  };

  const reset = () => {
    setNumStudents("");
    setFormationDetails("");
    setIsActive(false);
    setFilteredCourses([]);
  };

  return (
    <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Sparkles className="h-5 w-5" />
        Buscador Inteligente de Formación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-blue-800 mb-1 block">
            Detalles de la formación *
          </label>
          <Textarea
            value={formationDetails}
            onChange={(e) => setFormationDetails(e.target.value)}
            placeholder="Describe el rol y las necesidades formativas de las personas que quieres formar.
            Ej:'Formación en Excel avanzado para analistas financieros con experiencia básica. Necesitan aprender macros, tablas dinámicas y análisis de datos para reportes mensuales.'"
            rows={6}
            className="resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-blue-800 mb-1 block">
              ¿A cuánta gente más o menos quieres impactar?
            </label>
            <Input
              type="number"
              value={numStudents}
              onChange={(e) => setNumStudents(e.target.value)}
              placeholder="Ej: 25"
              min="1"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSmartFilter} className="bg-blue-600 hover:bg-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Buscar Formaciones Inteligentes
          </Button>
          {isActive && (
            <Button onClick={reset} variant="outline">
              Limpiar filtros
            </Button>
          )}
        </div>

        {isActive && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-blue-900">
              Formaciones Recomendadas ({filteredCourses.length})
            </h3>
            
            {filteredCourses.length === 0 && (
              <div className="p-3 text-center border rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-1">
                  No se encontraron formaciones que coincidan con tus criterios.
                </p>
                <p className="text-xs text-muted-foreground">
                  Las formaciones disponibles no cubren las horas mínimas para {numStudents} alumnos 
                  o no incluyen las habilidades específicas que buscas. 
                  Puedes crear una formación personalizada abajo.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map(course => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-2">{course.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BadgeCent className="h-3 w-3" />
                        <span>{course.credits} créditos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          <img src={avatar1} alt="" className="w-3 h-3 rounded-full border border-white" />
                          <img src={avatar2} alt="" className="w-3 h-3 rounded-full border border-white" />
                          <img src={avatar3} alt="" className="w-3 h-3 rounded-full border border-white" />
                        </div>
                        <span>{course.students.toLocaleString()} alumnos</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => navigateToFormationDetail(course)}
                      className="w-full mt-3" 
                      size="sm"
                      variant="outline"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {/* Custom Formation Card */}
              <Card className="border-dashed border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 transition-all">
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-6 w-6 text-amber-700" />
                    </div>
                    <h4 className="font-semibold text-sm text-amber-900 mb-2">
                      ✨ Formación Personalizada
                    </h4>
                    <p className="text-xs text-amber-700 mb-3">
                      Genera una formación específica para tus necesidades
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleCreateCustomFormation}
                    className="w-full border-amber-500 text-amber-700 hover:bg-amber-100" 
                    variant="outline"
                    size="sm"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Crear Formación Personalizada
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};