"use client";

import { useAppContext } from "@/app/state/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ShowUpLogo } from "@/app/components/icons";

export function GuestView() {
  const { state, dispatch } = useAppContext();
  const { eventDetails, guests, rsvpSubmitted } = state;
  const [name, setName] = useState("");

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch({ type: "ADD_GUEST", payload: { name } });
    }
  };
  
  const handleGoAgain = () => {
    setName("");
    dispatch({ type: "RESET_RSVP" });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="relative h-64 md:h-96 w-full">
          <Image
            src={eventDetails.coverPhotoUrl}
            alt={eventDetails.name}
            fill
            className="object-cover"
            priority
            data-ai-hint={eventDetails.coverPhotoHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-16 md:-mt-24 pb-12 relative z-10">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 border border-white/10">
            <div className="flex justify-between items-start">
              <h1 className="font-headline text-4xl md:text-6xl font-bold text-white mb-2">
                {eventDetails.name}
              </h1>
              <div className="flex items-center gap-2 text-accent pt-2">
                <Users className="w-5 h-5" />
                <span className="font-bold text-lg">{guests.length} going</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{eventDetails.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{eventDetails.venue}</span>
              </div>
            </div>

            <p className="text-lg text-foreground/80 mb-8 max-w-3xl">
              {eventDetails.description}
            </p>

            {rsvpSubmitted ? (
              <div className="text-center bg-primary/10 border border-primary rounded-lg p-8">
                <h2 className="font-headline text-4xl font-bold text-primary mb-4">You're on the list! 🎉</h2>
                <p className="text-lg text-foreground/80 mb-6">See you at {eventDetails.name}!</p>
                <Button variant="ghost" onClick={handleGoAgain}>RSVP for someone else</Button>
              </div>
            ) : eventDetails.rsvpsOpen ? (
              <form
                onSubmit={handleRsvp}
                className="flex flex-col sm:flex-row items-center gap-4 p-6 bg-background/50 rounded-lg"
              >
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-14 text-lg flex-grow"
                  required
                />
                <Button
                  type="submit"
                  className="w-full sm:w-auto h-14 text-lg font-bold px-10 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  RSVP NOW
                </Button>
              </form>
            ) : (
              <div className="text-center bg-destructive/10 border border-destructive rounded-lg p-8">
                <h2 className="font-headline text-3xl font-bold text-destructive-foreground">
                  Sorry, this event is full
                </h2>
                <p className="text-lg text-foreground/80 mt-2">RSVPs are now closed.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full p-4">
        <div className="container mx-auto flex justify-between items-center text-muted-foreground">
          <ShowUpLogo className="text-foreground" />
          <Link href="/dashboard" className="text-sm hover:text-accent transition-colors">
            Host Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
