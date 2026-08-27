import SwiftUI

@main
struct Re7letyApp: App {
    var body: some Scene {
        WindowGroup {
            SplashView()
                .preferredColorScheme(.dark)
        }
    }
}

struct SplashView: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var progress: CGFloat = 0
    @State private var showMain = false

    var body: some View {
        ZStack {
            Re7letyColor.bg.ignoresSafeArea()
            VStack(spacing: 24) {
                HStack(spacing: 0) {
                    Text("r").foregroundStyle(.white)
                    Text("7").foregroundStyle(Re7letyColor.accent)
                }
                .font(.system(size: 56, weight: .heavy, design: .rounded))

                Text("re7lety")
                    .font(.system(size: 28, weight: .bold, design: .default))
                    .tracking(8)

                Text("DRIVE BEYOND ORDINARY")
                    .font(.system(size: 11, weight: .medium))
                    .tracking(4)
                    .foregroundStyle(Re7letyColor.textSecondary)
            }

            VStack {
                Spacer()
                Capsule()
                    .fill(Color.white.opacity(0.08))
                    .frame(height: 2)
                    .overlay(alignment: .leading) {
                        Capsule()
                            .fill(Re7letyColor.accent)
                            .frame(width: 280 * progress, height: 2)
                    }
                    .padding(.horizontal, 48)
                    .padding(.bottom, 64)
            }
        }
        .onAppear {
            withAnimation(reduceMotion ? .easeOut(duration: 0.2) : .easeOut(duration: MotionTokens.cinematic)) {
                progress = 1
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + (reduceMotion ? 0.3 : 1.5)) {
                showMain = true
            }
        }
        .fullScreenCover(isPresented: $showMain) {
            Text("Open Xcode project & continue porting from React `/src` screens.")
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .background(Re7letyColor.bg)
        }
    }
}
