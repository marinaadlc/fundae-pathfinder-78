import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CreditCard, Users, BookOpen, Play, Star } from "lucide-react";
import avatar1 from "@/assets/avatar1.png";
import avatar2 from "@/assets/avatar2.png";
import avatar3 from "@/assets/avatar3.png";
import courseLogo from "@/assets/course-logo.png";
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
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/catalog")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Volver a catálogo
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-[#04253D] rounded-lg overflow-hidden text-white">
        <div className="flex">
          {/* Course Logo - Full Height */}
          <div className="bg-[#031C33] flex items-center justify-center p-8 w-48">
            <img 
              src={courseLogo} 
              alt={`${formation.title} logo`} 
              className="w-24 h-24 object-contain" 
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 p-8 space-y-4">
            {/* Badges */}
            <div className="flex items-center gap-3">
              {formation.isPopular && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Popular
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                {formation.category}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white hover:bg-white/10">
                {formation.level}
              </Badge>
            </div>
            
            {/* Title and Description */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{formation.title}</h1>
              <p className="text-white/80 text-lg leading-relaxed">{formation.description}</p>
            </div>
            
            {/* Stats Row with Action Button */}
            <div className="flex items-center justify-between pt-4">
              <Button 
                onClick={handleCreateAction} 
                className="bg-[#00E5A0] hover:bg-[#00E5A0]/90 text-black font-medium px-6 py-2 rounded-lg"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Generar Acción formativa
              </Button>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{formation.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">{formation.credits} Créditos/Alumno</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{formation.students} Alumnos</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">4.7</span>
                </div>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-[#04253D] rounded-lg text-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Contenidos de la formación</h2>
            <Badge variant="outline" className="border-white/30 text-white">
              {mockSubFormations.length} Cursos
            </Badge>
          </div>
          
          <div className="space-y-4">
            {mockSubFormations.map((subFormation, index) => (
              <div key={subFormation.id} className="border border-white/20 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl font-bold text-white/50 min-w-[2rem]">
                    {index + 1}.
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-white">{subFormation.title}</h3>
                    <p className="text-sm text-white/70 mb-3 line-clamp-3">
                      {subFormation.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>;
};
export default FormationDetail;