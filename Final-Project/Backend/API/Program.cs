using API.Mapper;
using Business_Layer.Services;
using Data_Layer.Context;
using Data_Layer.Entities.StripeClasses;
using Data_Layer.Repositories;
using Data_Layer.UnitOfWork;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Stripe;
using System.Text;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // CORS Configuration 
            #region CORS
            string CorsTxt = "_myCorsText";
            builder.Services.AddCors(op =>
            {
                op.AddPolicy(CorsTxt, b =>
                {
                    b.AllowAnyOrigin();
                    b.AllowAnyMethod();
                    b.AllowAnyHeader();
                });
            });
            #endregion

            // Context
            builder.Services.AddDbContext<WegoContext>(op =>
                op.UseLazyLoadingProxies()
                .UseSqlServer(builder.Configuration.GetConnectionString("wego1"))
            );

            // identity
            #region Identity
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 8;

            }).AddRoles<IdentityRole>()
            .AddDefaultTokenProviders()
            .AddEntityFrameworkStores<WegoContext>();
            #endregion

            // JWT Configuration
            #region JWT
            string jwtScheme = "myscheme";
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = jwtScheme;
                options.DefaultChallengeScheme = jwtScheme;
                options.DefaultScheme = jwtScheme;
            })
                .AddJwtBearer(jwtScheme, options =>
                {
                    var key = builder.Configuration.GetSection("JwtSettings")
                        .GetValue<string>("SecretKey");

                    var secretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        IssuerSigningKey = secretKey,
                        ValidateIssuerSigningKey = true

                    };
                });
            #endregion

            // Add DI services.
            #region Service/Repor (DI)
            // Service / unit
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IAirlineService, AirlineService>();
            builder.Services.AddScoped<IAirplaneService, AirplaneService>();
            builder.Services.AddScoped<IPaymentService, PaymentService>();
            builder.Services.AddScoped<IFlightBookingService, FlightBookingService>();
            builder.Services.AddScoped<IRoomRepository, RoomsRepository>();
            builder.Services.AddScoped<IBookingRepositroy, BookingRepositroy>();
            builder.Services.AddScoped<IRoomDetailsRepository, RoomDetailsRepository>();
            builder.Services.AddSingleton<IEmailService, EmailService>();
            builder.Services.AddSingleton<IMapper, Mapper.Mapper>();
            builder.Services.AddAutoMapper(typeof(Program));
            #endregion

            #region Stripe
            var stripeSettings = builder.Configuration.GetSection("Stripe");
            StripeConfiguration.ApiKey = stripeSettings["SecretKey"];
            builder.Services.Configure<StripeSettings>(stripeSettings);

            #endregion


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            // Swagger
            #region SwaggerConfiguration
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Your API", Version = "v1" });

                // Configure Swagger to use the Authorization header for JWT
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid JWT token.",
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });
            #endregion
             
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors(CorsTxt);
            app.UseStaticFiles();

            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
