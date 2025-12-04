import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Wrench, ShieldCheck, Banknote } from "lucide-react";
import { ProviderSignupForm } from "@/components/providers/ProviderSignupForm";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function ProviderJoinPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] -z-10" />

                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                            <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-6">
                                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                    Now accepting new partners
                                </div>
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                                    Grow your business with <span className="text-primary">Motor Ambos</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                                    Join the network of trusted mechanics and service providers. Get more jobs, guaranteed payments, and powerful tools to manage your operations.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Button size="lg" className="h-12 px-8 text-base transition-transform hover:scale-105" asChild>
                                        <Link href="#signup-form">
                                            Become a Partner <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="h-12 px-8 text-base hover:bg-muted/50" asChild>
                                        <Link href="/help/providers">Learn More</Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Hero Image / Graphic */}
                            <div className="flex-1 relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-backwards">
                                <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl p-6 md:p-8 max-w-md mx-auto rotate-3 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Wrench className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">New Request</h3>
                                            <p className="text-sm text-muted-foreground">Oil Change & Inspection</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                                                GHS 450.00
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 bg-muted rounded w-3/4"></div>
                                        <div className="h-2 bg-muted rounded w-1/2"></div>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <div className="flex-1 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-medium text-sm">
                                            Accept Job
                                        </div>
                                        <div className="flex-1 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-medium text-sm">
                                            Decline
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-3xl -z-10 rounded-full animate-pulse duration-[3000ms]" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="py-24 bg-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" />
                    <div className="container px-4 md:px-6 mx-auto relative">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How it works</h2>
                            <p className="text-lg text-muted-foreground">
                                Simple steps to start earning more with Motor Ambos.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            {[
                                {
                                    icon: CheckCircle2,
                                    title: "1. Sign Up",
                                    description: "Fill out the form below with your business details. It takes less than 5 minutes.",
                                    color: "text-blue-500",
                                    bg: "bg-blue-500/10",
                                    delay: "delay-0"
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "2. Get Verified",
                                    description: "Our team will review your application and verify your business credentials.",
                                    color: "text-purple-500",
                                    bg: "bg-purple-500/10",
                                    delay: "delay-150"
                                },
                                {
                                    icon: Banknote,
                                    title: "3. Start Earning",
                                    description: "Once approved, you'll start receiving service requests from drivers in your area.",
                                    color: "text-green-500",
                                    bg: "bg-green-500/10",
                                    delay: "delay-300"
                                }
                            ].map((step, index) => (
                                <div key={index} className={`group relative bg-card hover:bg-accent/5 border border-border rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards ${step.delay}`}>
                                    <div className={`h-14 w-14 rounded-xl ${step.bg} flex items-center justify-center mb-6 ${step.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <step.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                    <div className="absolute top-4 right-4 text-6xl font-black opacity-[0.03] select-none pointer-events-none">
                                        {index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Signup Form Section */}
                <section id="signup-form" className="py-20">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to join?</h2>
                                <p className="text-muted-foreground">
                                    Complete your application today.
                                </p>
                            </div>

                            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 animate-in fade-in zoom-in-95 duration-700 delay-500 fill-mode-backwards">
                                <ProviderSignupForm />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
