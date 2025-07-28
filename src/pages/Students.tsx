import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, Mail, User, Calendar, ChevronUp, ChevronDown } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  lastActivity: string;
  status: "active" | "inactive";
  lastCourse: string;
  currentCourse?: string;
  completedFormations: number;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Ana García López",
    email: "ana.garcia@empresa.com",
    lastActivity: "2 días",
    status: "active",
    lastCourse: "React Avanzado",
    currentCourse: "React Avanzado",
    completedFormations: 3
  },
  {
    id: 2,
    name: "Carlos Martín Ruiz",
    email: "carlos.martin@empresa.com",
    lastActivity: "5 días",
    status: "active",
    lastCourse: "Marketing Digital",
    currentCourse: "Marketing Digital",
    completedFormations: 1
  },
  {
    id: 3,
    name: "Elena Fernández Castro",
    email: "elena.fernandez@empresa.com",
    lastActivity: "1 semana",
    status: "inactive",
    lastCourse: "Gestión de RRHH",
    completedFormations: 2
  },
  {
    id: 4,
    name: "David López Moreno",
    email: "david.lopez@empresa.com",
    lastActivity: "3 semanas",
    status: "inactive",
    lastCourse: "Técnicas de Ventas",
    completedFormations: 4
  }
];

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Se está formando actualmente</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactivo</Badge>;
      default:
        return null;
    }
  };

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: keyof Student) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-muted-foreground/50" />;
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
      <ChevronDown className="h-4 w-4 text-muted-foreground" />;
  };

  const filteredAndSortedStudents = mockStudents
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Alumnos</h1>
          <p className="text-muted-foreground">Gestiona los participantes de tus formaciones</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Añadir alumno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Añadir nuevo alumno</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  placeholder="Introduce el nombre del alumno"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alumno@empresa.com"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">
                Cancelar
              </Button>
              <Button>
                Añadir alumno
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

     

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar alumnos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Se está formando actualmente</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      Alumno
                      {getSortIcon("name")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort("completedFormations")}
                    >
                      Formaciones realizadas
                      {getSortIcon("completedFormations")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort("currentCourse")}
                    >
                      Formación en curso
                      {getSortIcon("currentCourse")}
                    </button>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground">
                    <button 
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                      onClick={() => handleSort("lastActivity")}
                    >
                      Última actividad
                      {getSortIcon("lastActivity")}
                    </button>
                  </th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 pl-8 text-sm text-foreground font-medium">
                      {student.completedFormations}
                    </td>
                    <td className="p-4 text-sm text-foreground">
                      {student.status === "inactive" ? "-" : (
                        student.currentCourse ? (
                          <button 
                            onClick={() => navigate(`/action/${student.id}`)}
                            className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
                          >
                            {student.currentCourse}
                          </button>
                        ) : "-"
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Hace {student.lastActivity}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedStudents.length === 0 && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron alumnos</h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredAndSortedStudents.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Mostrando {filteredAndSortedStudents.length} de {mockStudents.length} alumnos.</span>
          <div className="flex items-center gap-2">
            <span>1 de 1</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;