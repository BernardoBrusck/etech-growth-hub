import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Users, 
  MapPin,
  Video,
  Phone,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  duration: number;
  type: "meeting" | "call" | "email" | "task";
  participants: string[];
  location?: string;
  leadId?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export function Calendar() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Reunião com João Silva",
      description: "Apresentação da proposta comercial",
      date: new Date(),
      time: "09:00",
      duration: 60,
      type: "meeting",
      participants: ["João Silva", "Ana Costa"],
      location: "Sala de Reuniões 1",
      leadId: "1",
      status: "scheduled"
    },
    {
      id: "2",
      title: "Follow-up Maria Santos",
      description: "Acompanhamento da negociação",
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: "14:00",
      duration: 30,
      type: "call",
      participants: ["Maria Santos", "Carlos Lima"],
      leadId: "2",
      status: "scheduled"
    },
    {
      id: "3",
      title: "Proposta para StartupX",
      description: "Envio da proposta comercial por email",
      date: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
      time: "10:00",
      duration: 15,
      type: "email",
      participants: ["Pedro Oliveira"],
      leadId: "3",
      status: "scheduled"
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "",
    duration: 60,
    type: "meeting" as Event["type"],
    participants: "",
    location: ""
  });

  const getEventIcon = (type: Event["type"]) => {
    switch (type) {
      case "meeting": return <Users className="h-4 w-4 text-chart-primary" />;
      case "call": return <Phone className="h-4 w-4 text-chart-secondary" />;
      case "email": return <Mail className="h-4 w-4 text-success" />;
      case "task": return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: Event["status"]) => {
    switch (status) {
      case "scheduled": return <Badge variant="default">Agendado</Badge>;
      case "completed": return <Badge className="bg-success text-success-foreground">Concluído</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelado</Badge>;
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      toast({
        title: "Erro",
        description: "Preencha o título e horário do evento",
        variant: "destructive",
      });
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
      participants: newEvent.participants.split(',').map(p => p.trim()).filter(Boolean),
      status: "scheduled"
    };

    setEvents([event, ...events]);
    setNewEvent({
      title: "",
      description: "",
      date: new Date(),
      time: "",
      duration: 60,
      type: "meeting",
      participants: "",
      location: ""
    });
    setShowNewEventModal(false);

    toast({
      title: "Evento criado!",
      description: `${event.title} foi agendado para ${event.date.toLocaleDateString()} às ${event.time}.`,
    });
  };

  const todayEvents = getEventsForDate(new Date());
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Calendário</h2>
          <p className="text-muted-foreground">Gerencie seus compromissos e atividades</p>
        </div>
        <Dialog open={showNewEventModal} onOpenChange={setShowNewEventModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar Novo Evento</DialogTitle>
              <DialogDescription>
                Crie um novo compromisso ou atividade.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título*</Label>
                <Input
                  id="title"
                  placeholder="Reunião com cliente"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Detalhes do evento"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data*</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date.toISOString().split('T')[0]}
                    onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário*</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo*</Label>
                  <Select value={newEvent.type} onValueChange={(value: Event["type"]) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meeting">Reunião</SelectItem>
                      <SelectItem value="call">Ligação</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="task">Tarefa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="60"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: parseInt(e.target.value) || 60 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="participants">Participantes</Label>
                <Input
                  id="participants"
                  placeholder="João Silva, Maria Santos"
                  value={newEvent.participants}
                  onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Local/Link</Label>
                <Input
                  id="location"
                  placeholder="Sala de reuniões ou link da videochamada"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowNewEventModal(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreateEvent} className="flex-1">
                  Agendar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 shadow-metric">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate?.toLocaleDateString('pt-BR', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              Clique em uma data para ver os eventos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Today's Events */}
        <Card className="shadow-metric">
          <CardHeader>
            <CardTitle className="text-lg">Hoje</CardTitle>
            <CardDescription>
              {todayEvents.length} eventos agendados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayEvents.length > 0 ? (
              todayEvents.map((event) => (
                <div key={event.id} className="p-3 border border-border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{event.time} ({event.duration}min)</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {event.participants.join(', ')}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum evento agendado para hoje
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      {selectedDate && selectedDateEvents.length > 0 && (
        <Card className="shadow-metric">
          <CardHeader>
            <CardTitle>
              Eventos para {selectedDate.toLocaleDateString('pt-BR')}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length} eventos agendados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventIcon(event.type)}
                      <span className="font-medium">{event.title}</span>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.time} - {event.duration} minutos</span>
                    </div>
                    
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.participants.join(', ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}