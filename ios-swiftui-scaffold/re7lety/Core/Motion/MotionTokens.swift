import SwiftUI

enum MotionTokens {
    static let instant: Double = 0.12
    static let fast: Double = 0.22
    static let normal: Double = 0.35
    static let cinematic: Double = 0.65
    static let hero: Double = 0.85

    static let buttonSpring = Animation.spring(response: 0.32, dampingFraction: 0.72)
    static let cardSpring = Animation.spring(response: 0.42, dampingFraction: 0.82)
    static let heroSpring = Animation.spring(response: 0.65, dampingFraction: 0.86)
}

enum Re7letyColor {
    static let bg = Color(red: 0.02, green: 0.02, blue: 0.02)
    static let elevated = Color(red: 0.063, green: 0.063, blue: 0.063)
    static let card = Color(red: 0.09, green: 0.09, blue: 0.09)
    static let secondary = Color(red: 0.125, green: 0.125, blue: 0.125)
    static let textPrimary = Color.white
    static let textSecondary = Color(red: 0.588, green: 0.588, blue: 0.588)
    static let muted = Color(red: 0.376, green: 0.376, blue: 0.376)
    static let accent = Color(red: 1.0, green: 0.208, blue: 0.282) // #FF3548
    static let yellow = Color(red: 0.914, green: 1.0, blue: 0.0)
}

struct Haptics {
    static func selection() {
        #if os(iOS)
        UISelectionFeedbackGenerator().selectionChanged()
        #endif
    }

    static func light() {
        #if os(iOS)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
    }

    static func success() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        #endif
    }
}
