var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<GameHub>("/gameHub");

app.MapGet("/", () => "Backend is working");

app.Run();