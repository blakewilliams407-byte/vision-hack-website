"use client";

import { useAppContext, type EventDetails } from "@/app/state/app-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Power, Users, Sparkles, Clock, User, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition, useEffect } from "react";
import { ShowUpLogo } from "./icons";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useFormState, useFormStatus } from "react-dom";
import { createVibeDescription, type VibeGenerationState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

function InlineEditField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  }

  return (
    <div className="flex items-center gap-2 group">
      {isEditing ? (
        <div className="flex items-center gap-1">
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8"
          />
          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={handleSave}><Check className="w-4 h-4" /></Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-lg">{value}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function VibeGenerator() {
  const { state, dispatch } = useAppContext();
  const { eventDetails } = state;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const initialState: VibeGenerationState = { message: null, description: null };
  const [formState, formAction] = useFormState(createVibeDescription, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (formState.message && formState.description) {
      dispatch({ type: 'UPDATE_EVENT_DETAILS', payload: { description: formState.description } });
      toast({ title: 'Vibe updated!', description: 'The new description has been applied to your event.' });
      setOpen(false);
    } else if (formState.message && !formState.description) {
      toast({ variant: 'destructive', title: 'Generation failed', description: formState.message });
    }
  }, [formState, dispatch, toast]);

  return (
     <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Vibe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Event Vibe</DialogTitle>
          <DialogDescription>
            Use AI to generate a captivating description for your event. Provide some keywords to guide the vibe.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="eventName" value={eventDetails.name} />
          <input type="hidden" name="eventDate" value={eventDetails.date} />
          <input type="hidden" name="eventTime" value={eventDetails.time} />
          <input type="hidden" name="eventVenue" value={eventDetails.venue} />
          
          <div>
            <Label htmlFor="vibeKeywords">Vibe Keywords (comma-separated)</Label>
            <Textarea
              id="vibeKeywords"
              name="vibeKeywords"
              placeholder="e.g., energetic, exclusive, retro, futuristic"
              className="mt-1"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate Description
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function HostDashboard() {
  const { state, dispatch } = useAppContext();
  const { eventDetails, guests } = state;

  const handleDetailSave = (key: keyof EventDetails) => (value: string) => {
    dispatch({ type: "UPDATE_EVENT_DETAILS", payload: { [key]: value } });
  };
  
  const handleDescriptionSave = (value: string) => {
    dispatch({ type: "UPDATE_EVENT_DETAILS", payload: { description: value } });
  };
  
  const toggleRsvps = () => {
    dispatch({ type: 'UPDATE_EVENT_DETAILS', payload: { rsvpsOpen: !eventDetails.rsvpsOpen } });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" aria-label="Home">
            <ShowUpLogo className="text-foreground" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-accent">
              <Users className="w-5 h-5" />
              <span className="font-bold text-lg">{guests.length} Guests</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="rsvp-toggle" className={eventDetails.rsvpsOpen ? 'text-green-400' : 'text-red-400'}>
                {eventDetails.rsvpsOpen ? 'RSVPs Open' : 'RSVPs Closed'}
              </Label>
              <Switch id="rsvp-toggle" checked={eventDetails.rsvpsOpen} onCheckedChange={toggleRsvps} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InlineEditField label="Event Name" value={eventDetails.name} onSave={handleDetailSave("name")} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InlineEditField label="Date" value={eventDetails.date} onSave={handleDetailSave("date")} />
                <InlineEditField label="Time" value={eventDetails.time} onSave={handleDetailSave("time")} />
                <InlineEditField label="Venue" value={eventDetails.venue} onSave={handleDetailSave("venue")} />
            </div>
             <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-base">Vibe Description</Label>
                <VibeGenerator />
              </div>
              <Textarea 
                value={eventDetails.description}
                onChange={(e) => handleDescriptionSave(e.target.value)}
                rows={4}
                className="text-base"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Guest List</CardTitle>
          </CardHeader>
          <CardContent>
            {guests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guests.map((guest) => (
                  <div key={guest.id} className="p-4 bg-card-foreground/5 rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-accent" />
                      <span className="font-medium text-lg">{guest.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3"/>
                      <span>{guest.rsvpTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No one has RSVP'd yet.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
