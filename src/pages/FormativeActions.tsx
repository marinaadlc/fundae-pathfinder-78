import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, MoreHorizontal, Calendar, Users, ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
interface FormativeAction {
  id: number;
  name: string;
  students: number;
  startDate: string;
  endDate: string;
  status: "solicited" | "scheduled" | "in-progress" | "completed";
}
type SortField = 'name' | 'students' | 'startDate' | 'endDate' | 'status';
type SortDirection = 'asc' | 'desc';
const mockActions: FormativeAction[] = [{
  id: 1,
  name: "SCRUM y metodologías Agile",
  students: 32,
  startDate: "20/05/2022",
  endDate: "30/06/2022",
  status: "solicited"
}, {
  id: 2,
  name: "Python para Data Science",
  students: 28,
  startDate: "25/04/2022",
  endDate: "15/06/2022",
  status: "scheduled"
}, {
  id: 3,
  name: "React y desarrollo web",
  students: 24,
  startDate: "20/03/2022",
  endDate: "10/05/2022",
  status: "in-progress"
}, {
  id: 4,
  name: "Gestión de proyectos",
  students: 18,
  startDate: "15/02/2022",
  endDate: "30/03/2022",
  status: "completed"
}];
const FormativeActions = () => {
  const [actions, setActions] = useState<FormativeAction[]>(mockActions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Load actions from localStorage on component mount
  useEffect(() => {
    const savedActions = localStorage.getItem('formativeActions');
    if (savedActions) {
      setActions(JSON.parse(savedActions));
    }
  }, []);

  // Save actions to localStorage whenever actions change
  useEffect(() => {
    localStorage.setItem('formativeActions', JSON.stringify(actions));
  }, [actions]);
  const getStatusBadge = (status: FormativeAction["status"]) => {
    switch (status) {
      case "solicited":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Solicitado</Badge>;
      case "scheduled":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-600">Programado</Badge>;
      case "in-progress":
        return <Badge variant="secondary" className="bg-green-100 text-green-600">En curso</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-purple-100 text-purple-600">Finalizado</Badge>;
      default:
        return null;
    }
  };
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const getSortIcon = (field: SortField) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 inline ml-1 text-primary" /> : <ChevronDown className="h-4 w-4 inline ml-1 text-primary" />;
    }
    // Mostrar flecha neutral para indicar que es ordenable
    return <ChevronUp className="h-4 w-4 inline ml-1 opacity-30" />;
  };
  const filteredAndSortedActions = actions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || action.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    if (sortField === 'startDate' || sortField === 'endDate') {
      aValue = new Date((aValue as string).split('/').reverse().join('-')).getTime();
      bValue = new Date((bValue as string).split('/').reverse().join('-')).getTime();
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  return <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Acciones formativas</h1>
        <p className="text-muted-foreground">Gestiona tus acciones formativas</p>
      </div>

      {/* Filters */}
       <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Buscar por nombre..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="solicited">Solicitado</SelectItem>
            <SelectItem value="scheduled">Programado</SelectItem>
            <SelectItem value="in-progress">En curso</SelectItem>
            <SelectItem value="completed">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
          <Link to="/create-action">
          <Button className="flex items-center gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Añadir acción
          </Button>
        </Link>
        
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('name')}>
                    Nombre{getSortIcon('name')}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('students')}>
                    Alumnos{getSortIcon('students')}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('startDate')}>
                    Fecha de inicio{getSortIcon('startDate')}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('endDate')}>
                    Fecha de fin{getSortIcon('endDate')}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleSort('status')}>
                    Estado{getSortIcon('status')}
                  </th>
                  <th className="w-12 p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedActions.map(action => <tr key={action.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Link to={`/action/${action.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {action.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{action.students}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{action.startDate}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{action.endDate}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(action.status)}
                    </td>
                    <td className="p-4">
                      
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
          
          {filteredAndSortedActions.length === 0 && <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron acciones formativas</p>
            </div>}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Mostrando 10 resultados por página de un total de 456 resultados.</span>
        <div className="flex items-center gap-2">
          <span>1 de 32</span>
          <Button variant="ghost" size="sm">→</Button>
        </div>
      </div>
    </div>;
};
export default FormativeActions;