import Foundation

struct FleetCar: Identifiable, Hashable, Codable {
    let id: String
    let name: String
    let brand: String
    let category: String
    let companyName: String
    let city: String
    let pricePerDay: Int
    let topSpeed: Int
    let horsepower: Int
    let acceleration: String
    let engine: String
    let drivetrain: String
    let seats: Int
    let heroImageURL: String
    let rating: Double
}

enum AlOmdaFleet {
    static let sample: [FleetCar] = [
        .init(id: "velocity-r", name: "VELOCITY R", brand: "re7lety", category: "Supercar",
              companyName: "Al Omda Office", city: "Cairo", pricePerDay: 18500, topSpeed: 300,
              horsepower: 825, acceleration: "2.6s", engine: "6.5L V12", drivetrain: "RWD",
              seats: 2, heroImageURL: "", rating: 4.9),
        .init(id: "g-class-night", name: "G-CLASS", brand: "Mercedes-Benz", category: "SUV",
              companyName: "Al Omda Office", city: "Cairo", pricePerDay: 9800, topSpeed: 220,
              horsepower: 585, acceleration: "4.5s", engine: "4.0L V8", drivetrain: "AWD",
              seats: 5, heroImageURL: "", rating: 4.9),
        .init(id: "lc300", name: "LAND CRUISER", brand: "Toyota", category: "SUV",
              companyName: "Al Omda Office", city: "Cairo", pricePerDay: 7200, topSpeed: 210,
              horsepower: 409, acceleration: "6.7s", engine: "3.5L V6", drivetrain: "AWD",
              seats: 7, heroImageURL: "", rating: 4.9),
    ]

    static let cities = ["Cairo", "Giza", "Alexandria", "North Coast", "Luxor", "Aswan"]
}
