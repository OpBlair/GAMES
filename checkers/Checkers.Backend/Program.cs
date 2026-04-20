using Checkers.Backend.Game; // Points to CheckersEngine
using Checkers.Backend.Hubs; // Points to GameHub

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddSingleton<GameManager>();

builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("http://127.0.0.1:8000", "http://localhost:8000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();
app.UseCors("AllowFrontend");

app.MapHub<GameHub>("/gameHub");
app.MapGet("/", () => "Backend is working");

app.Run();