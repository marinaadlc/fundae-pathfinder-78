import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, Calendar, Clock, Users, CheckCircle, ArrowUpDown, ArrowUp, ArrowDown, Award, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: number;
  name: string;
  progress: number;
  dedicationTime: number; // hours
  grade: number; // 0-10
}

type SortField = 'name' | 'progress' | 'dedicationTime' | 'grade';
type SortDirection = 'asc' | 'desc';

interface ActionDetail {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  weeklyDedication: number;
  duration: string; // Total duration of the formation
  status: "solicited" | "scheduled" | "in-progress" | "completed";
  students: Student[];
}

const mockActionDetails: { [key: number]: ActionDetail } = {
  1: {
    id: 1,
    name: "SCRUM y metodologías Agile",
    startDate: "2025-08-15",
    endDate: "2025-10-15", 
    weeklyDedication: 8,
    duration: "24 h. 30 min.",
    status: "solicited",
    students: [
      {
        id: 1,
        name: "Ana García López",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      },
      {
        id: 2,
        name: "Carlos Ruiz Martín",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      },
      {
        id: 3,
        name: "María Fernández Silva",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      }
    ]
  },
  2: {
    id: 2,
    name: "Python para Data Science",
    startDate: "2025-04-25",
    endDate: "2025-06-25", 
    weeklyDedication: 10,
    duration: "32 h. 15 min.",
    status: "scheduled",
    students: [
      {
        id: 4,
        name: "Elena Fernández Castro",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      },
      {
        id: 5,
        name: "David López Moreno",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      },
      {
        id: 6,
        name: "Laura Sánchez Torres",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      },
      {
        id: 7,
        name: "Miguel García Ruiz",
        progress: 0,
        dedicationTime: 0,
        grade: 0
      }
    ]
  },
  3: {
    id: 3,
    name: "React y desarrollo web",
    startDate: "2025-03-20",
    endDate: "2025-05-20", 
    weeklyDedication: 12,
    duration: "28 h. 45 min.",
    status: "in-progress",
    students: [
      {
        id: 8,
        name: "Ana García López",
        progress: 85,
        dedicationTime: 45,
        grade: 8.5
      },
      {
        id: 9,
        name: "Carlos Ruiz Martín",
        progress: 65,
        dedicationTime: 32,
        grade: 7.2
      },
      {
        id: 10,
        name: "María Fernández Silva",
        progress: 92,
        dedicationTime: 52,
        grade: 9.1
      },
      {
        id: 11,
        name: "David López González",
        progress: 45,
        dedicationTime: 28,
        grade: 6.8
      }
    ]
  },
  4: {
    id: 4,
    name: "Gestión de proyectos",
    startDate: "2025-02-15",
    endDate: "2025-04-15", 
    weeklyDedication: 6,
    duration: "18 h. 20 min.",
    status: "completed",
    students: [
      {
        id: 12,
        name: "Laura Sánchez Torres",
        progress: 100,
        dedicationTime: 78,
        grade: 9.3
      },
      {
        id: 13,
        name: "Miguel García Ruiz",
        progress: 95,
        dedicationTime: 72,
        grade: 8.8
      },
      {
        id: 14,
        name: "Carmen López Silva",
        progress: 88,
        dedicationTime: 65,
        grade: 8.1
      },
      {
        id: 15,
        name: "Antonio Martín Torres",
        progress: 92,
        dedicationTime: 70,
        grade: 8.6
      },
      {
        id: 16,
        name: "Isabel García López",
        progress: 85,
        dedicationTime: 62,
        grade: 7.9
      }
    ]
  }
};

const ActionDetail = () => {
  const { id } = useParams();
  const [action, setAction] = useState<ActionDetail | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');


  useEffect(() => {
    // Get action detail based on ID
    const actionId = parseInt(id || '1');
    const actionDetail = mockActionDetails[actionId] || mockActionDetails[1];
    setAction(actionDetail);
  }, [id]);

  if (!action) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  const getStatusBadge = (status: ActionDetail["status"]) => {
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

  const getProgressColor = (progress: number) => {
    return progress >= 75 ? "bg-green-500" : "bg-primary";
  };

  const getBonifiableStudentsCount = () => {
    return action?.students.filter(student => student.progress >= 75).length || 0;
  };

  const getDaysUntilStart = () => {
    const startDate = new Date(action?.startDate || '');
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilEnd = () => {
    const endDate = new Date(action?.endDate || '');
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysSinceStart = () => {
    const startDate = new Date(action?.startDate || '');
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const hasStarted = () => {
    return getDaysUntilStart() <= 0;
  };

  const isEditDisabled = () => {
    return getDaysUntilStart() < 4;
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
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
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />;
  };

  const sortedStudents = action?.students.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'name':
        aValue = a.name;
        bValue = b.name;
        break;
      case 'progress':
        aValue = a.progress;
        bValue = b.progress;
        break;
      case 'dedicationTime':
        aValue = a.dedicationTime;
        bValue = b.dedicationTime;
        break;
      case 'grade':
        aValue = a.grade;
        bValue = b.grade;
        break;
      default:
        return 0;
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  }) || [];

  return (
    <TooltipProvider>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{action.name}</h1>
            {getStatusBadge(action.status)}
          </div>
        </div>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div>
              <Link to={`/action/${action.id}/edit`}>
                <Button 
                  variant="outline" 
                  disabled={isEditDisabled()}
                  className="flex items-center gap-2 border-purple-500 text-purple-600 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar acción
                </Button>
              </Link>
            </div>
          </TooltipTrigger>
          {isEditDisabled() && (
            <TooltipContent>
              <p>Las formaciones solo pueden editarse hasta 4 días antes del inicio</p>
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Action Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                 <p className="font-semibold">{formatDateForDisplay(action.startDate)}</p>
                {(action.status === "scheduled" || action.status === "solicited") && getDaysUntilStart() > 0 && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Empieza en {getDaysUntilStart()} días
                  </p>
                )}
                {action.status === "in-progress" && getDaysSinceStart() > 0 && (
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Iniciada hace {getDaysSinceStart()} días
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
               <div>
                 <p className="text-sm text-muted-foreground">Fecha de fin</p>
                 <p className="font-semibold">{formatDateForDisplay(action.endDate)}</p>
                 {action.status === "in-progress" && getDaysUntilEnd() > 0 && (
                   <p className="text-xs text-blue-600 mt-1 font-medium">
                     Finaliza en {getDaysUntilEnd()} días
                   </p>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Dedicación semanal</p>
                <p className="font-semibold">{action.weeklyDedication} horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Alumnos bonificables</p>
                <p className="font-semibold">{getBonifiableStudentsCount()}/{action.students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Alumnos ({action.students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div 
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() => handleSort('name')}
                  >
                    <span>Nombre completo</span>
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() => handleSort('progress')}
                  >
                    <span>Progreso</span>
                    {getSortIcon('progress')}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() => handleSort('dedicationTime')}
                  >
                    <span>Tiempo dedicación</span>
                    {getSortIcon('dedicationTime')}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center gap-1 cursor-pointer select-none"
                    onClick={() => handleSort('grade')}
                  >
                    <span>Calificación</span>
                    {getSortIcon('grade')}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{`${student.name.split(' ')[0].toLowerCase()}.${student.name.split(' ').slice(1).join('').toLowerCase()}@empresa.com`}</p>
                      </div>
                      {student.progress >= 75 && (
                        <div className="flex items-center gap-1">
                          <TooltipProvider>
                            <Tooltip delayDuration={0}>
                              <TooltipTrigger><div className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-green-500 font-medium">bonificable</span></div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Alcanzado el progreso para bonificar</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-[100px]">
                        <Progress 
                          value={student.progress} 
                          className="h-2"
                        />
                      </div>
                      <span className={`text-sm font-medium ${student.progress >= 75 ? 'text-green-600' : 'text-foreground'}`}>
                        {student.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{student.dedicationTime}h</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">{student.grade.toFixed(1)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {action.students.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay alumnos registrados en esta acción formativa</p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </TooltipProvider>
  );
};

export default ActionDetail;