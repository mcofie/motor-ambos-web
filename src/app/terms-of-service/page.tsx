import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";
import LegalPage from "@/components/landing-home/LegalPage";

export const metadata: Metadata = publicPageMetadata("Terms of Service", "The terms for using the Motor Ambos website, app and Smart Cards.", "/terms-of-service");

export default function TermsOfServicePage() {
    return <LegalPage
        eyebrow="Terms"
        title="Terms of Service"
        updated="14 October 2026"
        intro="These terms apply when you use the Motor Ambos website, app and Smart Cards. By creating an account or using the service, you agree to them."
        sections={[
            { title: "The service", body: <p>Motor Ambos helps you keep your car&apos;s papers and records in one place, reminds you before papers expire, helps you find roadside providers nearby, and lets you share a car&apos;s details through a Smart Card. Fleets can manage several vehicles and drivers.</p> },
            { title: "Your account", body: <ul>
                <li>Give accurate details and keep them up to date.</li>
                <li>Keep your sign-in details private. You are responsible for activity on your account.</li>
                <li>Only add cars you own, drive, or manage with the owner&apos;s permission.</li>
            </ul> },
            { title: "Papers and reminders", body: <p>Expiry dates and documents in Motor Ambos are records you or your fleet add. Reminders are a convenience. They do not confirm that a car is legally insured or roadworthy, and you remain responsible for renewing papers on time. If you ask us to handle a renewal, a fee may apply and will be shown before you agree.</p> },
            { title: "Roadside help", body: <>
                <p>Roadside providers listed on Motor Ambos are independent businesses, not our employees or agents. We show listed details such as distance, services and call-out fee where supplied, but we do not guarantee a provider&apos;s availability, price or work.</p>
                <p>Agree the work and the full price with the provider before any repair starts. Any agreement for roadside work is between you and the provider.</p>
            </> },
            { title: "Smart Cards", body: <ul>
                <li>A Smart Card can be linked only by someone who holds the card and its claim code and confirms a code sent to their phone.</li>
                <li>You choose what a linked card shows and can change it or unlink the card at any time.</li>
                <li>Keep the card&apos;s claim code private. If a card is lost, unlink it in the app and contact us for a replacement.</li>
            </ul> },
            { title: "Records added by others", body: <p>Mechanics can add service records to your car once you approve them with a code sent to your phone. Records marked as recorded by a mechanic come from that mechanic. We do not inspect cars or check the work described.</p> },
            { title: "Acceptable use", body: <p>Do not use Motor Ambos to break the law, upload content you do not have the right to share, impersonate someone else, access other people&apos;s information without permission, or interfere with the service.</p> },
            { title: "Our liability", body: <p>We work to keep Motor Ambos accurate and available, but the service is provided as it is. To the extent the law allows, we are not responsible for losses caused by missed reminders, information you or others entered, or the actions of independent providers. Nothing in these terms limits rights you have under consumer law.</p> },
            { title: "Ending your use", body: <p>You can stop using Motor Ambos and ask us to close your account at any time. We may suspend accounts that break these terms or put other users at risk.</p> },
            { title: "Changes and contact", body: <p>We may update these terms and will show the date of the latest version at the top of this page. For questions or complaints, email <a href="mailto:support@motorambos.com">support@motorambos.com</a>.</p> },
        ]}
    />;
}
