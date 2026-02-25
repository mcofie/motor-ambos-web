"use client";

import React from "react";
import { Bell, Calendar, Clock } from "lucide-react";

export function PerkPlan() {
    return (
        <section id="plan" className="uber-section-grey border-t border-border">
            <div className="uber-container">
                <div className="space-y-12">
                    <div className="max-w-xl space-y-4">
                        <h2 className="uber-heading-section">
                            Stay compliant before <br /> it becomes a problem.
                        </h2>
                        <p className="uber-body">
                            Our predictive system keeps an eye on the dates that matter.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Document expiry",
                                desc: "30-day reminders for roadworthy and insurance renewals via push and SMS.",
                                icon: Bell
                            },
                            {
                                title: "Service due alerts",
                                desc: "Based on mileage trends, we notify you when it's time for periodic maintenance.",
                                icon: Clock
                            },
                            {
                                title: "Scheduled tracking",
                                desc: "Sync your vehicle service plan directly into your calendar.",
                                icon: Calendar
                            }
                        ].map((item, i) => (
                            <div key={i} className="space-y-6">
                                <div className="w-12 h-12 flex items-center justify-center">
                                    <item.icon size={28} className="text-black" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                                    <p className="uber-body text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
