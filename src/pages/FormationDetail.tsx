import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CreditCard, Users, BookOpen, Play, Star } from "lucide-react";
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

// Mock data - esto debería venir de una API o estado global
const mockCourses: Course[] = [{
  id: 1,
  title: "Automatización en Excel con VBA",
  description: "Aprende a automatizar tareas repetitivas en Excel usando VBA y mejora tu productividad.",
  category: "Ofimática",
  duration: "10 h. 18 min.",
  courses: 2,
  level: "Intermedio",
  students: 1240,
  isPopular: true,
  credits: 7
}, {
  id: 2,
  title: "Blockchain: Fundamentos y Aplicaciones",
  description: "Comprende la tecnología blockchain y sus aplicaciones en diferentes industrias.",
  category: "Blockchain",
  duration: "5 h. 18 min.",
  courses: 3,
  level: "Principiante",
  students: 890,
  credits: 7
}, {
  id: 3,
  title: "Certificación Cisco CCNA 200-301",
  description: "Prepárate para la certificación CCNA con este curso completo de redes.",
  category: "Ciberseguridad",
  duration: "6 h. 18 min.",
  courses: 12,
  level: "Avanzado",
  students: 2150,
  credits: 9
}, {
  id: 4,
  title: "Fundamentos de Inteligencia Artificial",
  description: "Introducción completa a los conceptos fundamentales de la IA y machine learning.",
  category: "IA",
  duration: "12 h. 18 min.",
  courses: 8,
  level: "Intermedio",
  students: 3200,
  credits: 7
}, {
  id: 5,
  title: "Marketing Digital Avanzado",
  description: "Estrategias avanzadas de marketing digital para el crecimiento empresarial.",
  category: "Marketing",
  duration: "8 h. 30 min.",
  courses: 6,
  level: "Avanzado",
  students: 1890,
  credits: 8
}, {
  id: 6,
  title: "Gestión de Proyectos con Scrum",
  description: "Domina la metodología Scrum para gestionar proyectos de manera eficiente.",
  category: "Gestión",
  duration: "15 h. 45 min.",
  courses: 10,
  level: "Intermedio",
  students: 2670,
  credits: 12
}];
const mockSubFormations = [{
  id: 1,
  title: "Especialización en JavaScript: Asincronía, Prototipos, y Clases",
  duration: "1 h. 18 min.",
  credits: 2,
  description: "Aprende a utilizar PowerShell desde cero con este curso de PowerShell para principiantes y saca todo el potencial de esta gran herramienta de línea de comandos de Windows para administradores de sistemas."
}, {
  id: 2,
  title: "Especialización en JavaScript: DOM y Eventos",
  duration: "1 h. 18 min.",
  credits: 2,
  description: "Domina la manipulación del DOM y el manejo de eventos en JavaScript para crear aplicaciones web interactivas."
}, {
  id: 3,
  title: "Especialización en JavaScript: APIs y AJAX",
  duration: "1 h. 18 min.",
  credits: 2,
  description: "Aprende a consumir APIs REST y manejar peticiones asíncronas con AJAX y Fetch API."
}, {
  id: 4,
  title: "Especialización en JavaScript: Frameworks Modernos",
  duration: "1 h. 18 min.",
  credits: 1,
  description: "Introducción a los frameworks modernos de JavaScript como React, Vue y Angular."
}];
const FormationDetail = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const formation = mockCourses.find(course => course.id === parseInt(id || "0"));
  if (!formation) {
    return <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Formación no encontrada</h2>
        <Button onClick={() => navigate("/catalog")}>Volver al catálogo</Button>
      </div>;
  }
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante":
        return "bg-green-100 text-green-700";
      case "Intermedio":
        return "bg-yellow-100 text-yellow-700";
      case "Avanzado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const handleCreateAction = () => {
    // Navegar al flujo de creación paso 2 (selección de alumnos)
    navigate(`/create-action?step=2&formationId=${formation.id}`);
  };
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/catalog")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row relative">
            {/* Image Section */}
            <div className="w-full md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative overflow-hidden">
              <BookOpen className="h-16 w-16 text-primary/60" />
              {formation.isPopular && <div className="absolute top-4 right-4 flex items-center gap-1 bg-orange-500 text-white px-3 py-2 rounded-full">
                  <Star className="h-4 w-4 fill-current" />
                  <span>Popular</span>
                </div>}
            </div>
            
            {/* Content Section */}
            <div className="flex-1 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary">{formation.category}</Badge>
                <Badge variant="outline" className={getLevelColor(formation.level)}>
                  {formation.level}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">{formation.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">{formation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créditos / alumno</p>
                    <p className="font-semibold">{formation.credits}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duración</p>
                    <p className="font-semibold">{formation.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Alumnos matriculados</p>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <img src={avatar1} alt="Student avatar" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                        <img src={avatar2} alt="Student avatar" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                        <img src={avatar3} alt="Student avatar" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
                      </div>
                      <span className="font-semibold">{formation.students.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button size="lg" onClick={handleCreateAction} className="px-8 rounded-3xl">
                <Play className="h-5 w-5 mr-2" />
                Crear acción formativa con esta formación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Contenidos de la formación
            <Badge variant="outline" className="ml-auto">
              {mockSubFormations.length} Cursos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockSubFormations.map((subFormation, index) => <div key={subFormation.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="text-2xl font-bold text-muted-foreground/50 min-w-[2rem]">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{subFormation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {subFormation.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{subFormation.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      <span>{subFormation.credits} créditos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>)}
        </CardContent>
      </Card>
    </div>;
};
export default FormationDetail;