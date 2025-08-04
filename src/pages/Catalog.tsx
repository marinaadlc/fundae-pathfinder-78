import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, BookOpen, Star, Users, CreditCard, BadgeCent } from "lucide-react";
import { Link } from "react-router-dom";
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
  image?: string;
  credits: number;
}
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
const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const categories = ["Ofimática", "Blockchain", "Ciberseguridad", "IA", "Marketing", "Gestión"];
  const levels = ["Principiante", "Intermedio", "Avanzado"];
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });
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
  return <div className="space-y-6">
      {/* Header */}
      <div>
        
        
      </div>

      {/* Main Search */}
      <div className="flex flex-col items-center justify-center py-12 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Catálogo de formaciones</h2>
          <p className="text-xl text-muted-foreground max-w-2xl">Busca entre cientos de formaciones bonificables para tu equipo</p>
        </div>
        
        <div className="w-full max-w-2xl relative">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
          <Input placeholder="Buscar formaciones..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-16 h-16 text-lg rounded-2xl border-2 focus:border-primary shadow-lg" />
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-none">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md ml-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los niveles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className={`grid grid-cols-1 gap-6 ${filteredCourses.length === 0 ? 'md:grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredCourses.map(course => <Link key={course.id} to={`/course/${course.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Header with icon and badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {course.level}
                    </Badge>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-3 group-hover:text-primary transition-colors text-white">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                {/* Footer with stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeCent className="h-4 w-4" />
                    <span>{course.credits} Créditos/Alumno</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} Alumnos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>)}

        {/* Custom Training Card - Now expands when no results */}
        <Link to="/custom-formation" className={filteredCourses.length === 0 ? 'md:col-span-2 lg:col-span-3' : ''}>
          <Card className="group hover:shadow-lg transition-all duration-200 border-dashed border-2 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-300 hover:from-teal-100 hover:to-cyan-100 hover:border-teal-400">
            <CardContent className={`p-6 h-full flex flex-col justify-between ${filteredCourses.length === 0 ? 'text-center' : ''}`}>
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-teal-700" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-3 text-center text-teal-900">✨ Crea tu formación personalizada</h3>
                
                <p className={`text-teal-800 text-sm mb-4 text-center ${filteredCourses.length === 0 ? 'text-base' : ''}`}>
                  {filteredCourses.length === 0 ? '¿No encuentras lo que buscas? Crea una formación personalizada que se adapte exactamente a tus necesidades combinando nuestros cursos individuales.' : '¿Ninguna de nuestras formaciones encaja con lo que buscas? Crea una personalizada combinando nuestros cursos individuales.'}
                </p>
                
                <div className="p-3 rounded-lg mb-4 bg-amber-100/0">
                  <p className="text-xs text-teal-700 text-center">✨ Requiere 1 día laborable de gestión</p>
                </div>
              </div>
              
              <Button className="w-full border-teal-500 text-teal-700 hover:bg-teal-100" variant="outline">
                Crear formación personalizada
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>


      {/* Results Counter */}
      {filteredCourses.length > 0 && <div className="text-center text-sm text-muted-foreground">
          Mostrando {filteredCourses.length} de {mockCourses.length} rutas formativas
        </div>}
    </div>;
};
export default Catalog;