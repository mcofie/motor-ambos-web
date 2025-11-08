import Image from "next/image"
import Link from "next/link"

export function AppStoreButtons() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            {/* Google Play */}
            <Link
                href="https://play.google.com/store/apps/details?id=com.motorambos"
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                    alt="Get it on Google Play"
                    width={160}
                    height={40}
                    className="h-auto w-auto"
                />
            </Link>

            {/* App Store */}
            <Link
                href="https://apps.apple.com/app/id000000000" // Replace with your actual app ID
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                    width={190}
                    height={54}
                    className="h-auto w-auto dark:invert-0"
                />
            </Link>
        </div>
    )
}