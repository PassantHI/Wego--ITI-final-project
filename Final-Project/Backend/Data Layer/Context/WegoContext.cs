using Data_Layer.Entities.Booking;
using Data_Layer.Entities.enums;
using Data_Layer.Entities.Flights;
using Data_Layer.Entities.Room;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Data_Layer.Context
{
    public class WegoContext:IdentityDbContext<ApplicationUser>
    {
        public WegoContext() { }
        public WegoContext(DbContextOptions<WegoContext> op): base(op) { }

        // sets
        public DbSet<Airline> Airlines { get; set; }
        public DbSet<Airplane> Airplanes { get; set; }
        public DbSet<Airport> Airports { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Flight> Flights { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Seat> Seats { get; set; }
        public DbSet<Terminal> Terminals { get; set; }
        public DbSet<FlightBooking> FlightBookings { get; set; }
        public DbSet<SeatReservation> SeatReservations { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Images> Images { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<RoomBookingDetails> RoomBookingDetails { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            // relations
            builder.Entity<Airport>()
                .HasOne(a => a.Location)
                .WithMany(l => l.Airports)
                .HasForeignKey(a => a.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Airplane>()
                .HasOne(a => a.Airline)
                .WithMany(al => al.Airplanes)
                .HasForeignKey(a => a.AirlineId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Flight>()
                .HasOne(f => f.Airplane)
                .WithMany(a => a.Flights)
                .HasForeignKey(f => f.AirplaneId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Flight>()
                .HasOne(f => f.Airline)
                .WithMany(a => a.Flights)
                .HasForeignKey(f => f.AirlineId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Flight>()
                .HasOne(f => f.DepartureTerminal)
                .WithMany(t=>t.DepartureFlights)
                .HasForeignKey(f => f.DepartureTerminalId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Flight>()
                .HasOne(f => f.ArrivalTerminal)
                .WithMany(t=>t.ArriveFlights)
                .HasForeignKey(f => f.ArrivalTerminalId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Terminal>()
                .HasOne(t => t.Airport)
                .WithMany(a => a.Terminals)
                .HasForeignKey(t => t.AirportId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Seat>()
                .HasOne(s => s.Airplane)
                .WithMany(a => a.Seats)
                .HasForeignKey(s => s.AirplaneId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Feature>()
                .HasOne(f => f.Airplane)
                .WithOne(a => a.Feature)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FlightBooking>()
                .HasOne(fb => fb.User)
                .WithMany(u => u.FlightBookings)
                .HasForeignKey(fb => fb.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<FlightBooking>()
                .HasOne(fb => fb.Flight)
                .WithMany(f => f.FlightBookings)
                .HasForeignKey(fb => fb.FlightId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<SeatReservation>()
                .HasOne(sr => sr.FlightBooking)
                .WithMany(fb => fb.SeatReservations)
                .HasForeignKey(sr => sr.FlightBookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<SeatReservation>()
                .HasOne(sr => sr.Seat)
                .WithMany(s => s.SeatReservations)
                .HasForeignKey(sr => sr.SeatId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Images>()
                .HasOne(i => i.Room)
                .WithMany(r => r.Images)
                .HasForeignKey(i => i.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            // seeds
            //Roles
            var admin = new IdentityRole
            {
                Id = "9d1b777e-2c20-444e-ad26-6a77b1caec51", 
                Name = "admin",
                NormalizedName = "ADMIN"
            };

            var employee = new IdentityRole
            {
                Id = "49f188a4-8196-419b-80cc-31091d58ccda", 
                Name = "employee",
                NormalizedName = "EMPLOYEE"
            };

            var client = new IdentityRole
            {
                Id = "05eaefd4-f2ae-4ba9-92d3-c98e69b0273c",
                Name = "client",
                NormalizedName = "CLIENT"
            };

            builder.Entity<IdentityRole>().HasData(admin, employee, client);



            base.OnModelCreating(builder);
        }
    }
}
