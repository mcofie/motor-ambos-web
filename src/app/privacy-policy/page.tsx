import type { Metadata } from "next";
import { publicPageMetadata } from "@/lib/metadata";
import LegalPage from "@/components/landing-home/LegalPage";

export const metadata: Metadata = publicPageMetadata("Privacy Policy", "How Motor Ambos collects, uses and protects information about you and your car.", "/privacy-policy");

export default function PrivacyPolicyPage() {
    return <LegalPage
        eyebrow="Privacy"
        title="Privacy Policy"
        updated="14 October 2026"
        intro="This policy explains what information Motor Ambos collects when you use our website, app and Smart Cards, why we collect it, who we share it with, and the choices you have."
        sections={[
            { title: "Information we collect", body: <>
                <p>We collect only what we need to run the service:</p>
                <ul>
                    <li><strong>Account details:</strong> your name, email address and phone number.</li>
                    <li><strong>Car details:</strong> plate number, make, model, year and colour, and the expiry dates of papers such as insurance and roadworthy.</li>
                    <li><strong>Documents and photos you upload:</strong> copies of car papers, photos of your driver&apos;s licence, your licence number, class and expiry date, and a profile photo if you add one.</li>
                    <li><strong>Car records:</strong> service and repair entries, fuel fill-ups and reported problems, including those added by a mechanic you approve.</li>
                    <li><strong>Location:</strong> your location when you choose to share it to find roadside help.</li>
                    <li><strong>Usage information:</strong> pages visited, device and browser type, and similar information collected through analytics.</li>
                </ul>
            </> },
            { title: "How we use it", body: <ul>
                <li>To keep your car&apos;s record and show it to you and anyone you share it with.</li>
                <li>To send reminders by text message before papers expire.</li>
                <li>To find roadside providers near you and prepare a message for the provider you choose.</li>
                <li>To verify your phone with one-time codes, for example when linking a Smart Card.</li>
                <li>To keep the service secure, fix problems and improve it.</li>
            </ul> },
            { title: "Smart Card pages", body: <>
                <p>Tapping a Smart Card opens a page about the linked car. You choose what that page shows: car details, plate number, papers status, service history, your driver profile and a call button. Each can be switched off at any time in the app.</p>
                <p>Your licence number, licence photos and uploaded documents are never shown on a Smart Card page. If you drive a fleet car, you can choose whether your profile appears on that car&apos;s page.</p>
            </> },
            { title: "Who we share it with", body: <>
                <p>We do not sell your information. We share it only:</p>
                <ul>
                    <li><strong>With roadside providers you contact.</strong> They are independent businesses. When you call or message one, they receive what you send them, such as your name, phone number, car details and location.</li>
                    <li><strong>With your fleet,</strong> if you drive a car managed by a fleet, which can see that car&apos;s records and problems you report.</li>
                    <li><strong>With service companies that run parts of Motor Ambos for us,</strong> such as hosting and database storage, text message delivery and website analytics. They may use the information only to provide those services.</li>
                    <li><strong>When required by law,</strong> or to protect the safety of our users or the public.</li>
                </ul>
            </> },
            { title: "How we protect it", body: <p>Documents and licence photos are kept in private storage and opened only through short-lived links for people allowed to see them. Access to accounts is protected by sign-in, and sensitive actions such as linking a Smart Card need a code sent to your phone.</p> },
            { title: "How long we keep it", body: <p>We keep your information while your account is open. When you replace a document or photo, we delete the old copy. If you ask us to close your account, we delete or anonymise your information unless we need to keep it to meet a legal obligation.</p> },
            { title: "Your choices and rights", body: <ul>
                <li>View and update your details, documents and car records in the app.</li>
                <li>Change what your Smart Card shows, or unlink the card.</li>
                <li>Ask us for a copy of your information, or ask us to correct or delete it.</li>
            </ul> },
            { title: "Changes to this policy", body: <p>We will update this page when our practices change and show the date of the latest version at the top. If a change is significant, we will tell you in the app or by email.</p> },
            { title: "Contact us", body: <p>For any privacy question or request, email <a href="mailto:support@motorambos.com">support@motorambos.com</a>.</p> },
        ]}
    />;
}
