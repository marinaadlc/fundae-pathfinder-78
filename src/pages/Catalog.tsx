import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, BookOpen, Star, Users, CreditCard, BadgeCent } from "lucide-react";
import { Link } from "react-router-dom";
import { SmartFormationSelector } from "@/components/SmartFormationSelector";
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Formaciones</h1>
        <p className="text-muted-foreground">Explora las formaciones bonificables que puedes lanzar a tu equipo</p>
      </div>

      {/* Smart Formation Selector */}
      <SmartFormationSelector courses={mockCourses} />

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Buscar rutas formativas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
            <Link to={`/course/${course.id}`}>
              <CardContent className="p-0">
                {/* Course Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center relative overflow-hidden">
                  <BookOpen className="h-16 w-16 text-primary/60" />
                  {course.isPopular && <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Popular</span>
                    </div>}
                </div>

                <div className="p-6">
                  {/* Category and Level */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline" className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>

                  {/* Title and Description */}
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BadgeCent className="h-4 w-4 text-muted-foreground" />
                      <span>{course.credits} créditos / alumno</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <div className="flex -space-x-1">
                        <img src={avatar1} alt="Student avatar" className="w-4 h-4 rounded-full border border-white object-cover" />
                        <img src={avatar2} alt="Student avatar" className="w-4 h-4 rounded-full border border-white object-cover" />
                        <img src={avatar3} alt="Student avatar" className="w-4 h-4 rounded-full border border-white object-cover" />
                      </div>
                      <span>{course.students.toLocaleString()} alumnos</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full" variant="outline">
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>)}

        {/* Custom Training Card */}
        <Link to="/custom-formation">
          <Card className="group hover:shadow-lg transition-all duration-200 border-dashed border-2 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-400">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-amber-700" />
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-3 text-center text-amber-900">
                  ✨ Formación personalizada
                </h3>
                
                <p className="text-amber-800 text-sm mb-4 text-center">
                  ¿No encuentras lo que buscas? Nuestra IA creará una formación a medida para tu equipo.
                </p>
                
                <div className="p-3 rounded-lg mb-4 bg-amber-100/0">
                  <p className="text-xs text-amber-700 text-center">✨ Se gestiona en 1 día laborable</p>
                </div>
              </div>
              
              <Button className="w-full border-amber-500 text-amber-700 hover:bg-amber-100" variant="outline">
                Crear formación personalizada
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron rutas</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
          </CardContent>
        </Card>}

      {/* Results Counter */}
      {filteredCourses.length > 0 && <div className="text-center text-sm text-muted-foreground">
          Mostrando {filteredCourses.length} de {mockCourses.length} rutas formativas
        </div>}
    </div>;
};
export default Catalog;