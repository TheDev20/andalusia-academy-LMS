using AndalusiaAcademy.API.Data;
using AndalusiaAcademy.API.Models.Catalog;
using Microsoft.EntityFrameworkCore;

namespace AndalusiaAcademy.API.Data.Seed;

public static class CatalogDbSeeder
{
    public static async Task SeedCatalogAsync(ApplicationDbContext context)
    {
        if (await context.Courses.AnyAsync())
        {
            return; 
        }

        var categories = new Dictionary<string, Category>
        {
            ["Software Engineering"] = new() { Name = "Software Engineering", Slug = "software-engineering" },
            ["AI & Machine Learning"] = new() { Name = "AI & Machine Learning", Slug = "ai-machine-learning" },
            ["Data Science"] = new() { Name = "Data Science", Slug = "data-science" },
            ["Cloud & DevOps"] = new() { Name = "Cloud & DevOps", Slug = "cloud-devops" },
            ["Cybersecurity"] = new() { Name = "Cybersecurity", Slug = "cybersecurity" }
        };

        await context.Categories.AddRangeAsync(categories.Values);
        await context.SaveChangesAsync();

        var now = DateTimeOffset.UtcNow;

        var courses = new List<(Course course, string category, decimal price, int daysUntilStart)>
        {
            (
                new Course
                {
                    Title = "ASP.NET Core & Enterprise Microservices Masterclass",
                    Slug = "aspnet-core-enterprise",
                    Description = "Architect high-performance distributed systems using .NET 10, EF Core code-first migrations, SQL Server, Clean Architecture, and Redis caching.",
                    PublicationStatus = "Published"
                },
                "Software Engineering",
                750m,
                8
            ),
            (
                new Course
                {
                    Title = "Applied Generative AI, LLMs & Autonomous Agents Bootcamp",
                    Slug = "applied-genai-llm",
                    Description = "Build production-ready agentic AI systems using LangChain, vector databases, RAG architectures, and fine-tuned open-source LLMs.",
                    PublicationStatus = "Published"
                },
                "AI & Machine Learning",
                950m,
                24
            ),
            (
                new Course
                {
                    Title = "Modern Full-Stack React 19 & TypeScript Systems Architecture",
                    Slug = "react-fullstack-architecture",
                    Description = "Master Next.js App Router, React Server Components, state management, full-stack typed APIs, and scalable modular design systems.",
                    PublicationStatus = "Published"
                },
                "Software Engineering",
                680m,
                13
            ),
            (
                new Course
                {
                    Title = "Data Science & Machine Learning Engineering Specialization",
                    Slug = "data-science-ml",
                    Description = "Master statistical machine learning with Python, Pandas, Scikit-Learn, PyTorch neural networks, feature engineering, and production MLOOps.",
                    PublicationStatus = "Published"
                },
                "Data Science",
                820m,
                33
            ),
            (
                new Course
                {
                    Title = "Big Data Engineering with Apache Spark & Google BigQuery",
                    Slug = "bigdata-spark-bigquery",
                    Description = "Process massive streaming datasets using Apache Spark, build scalable cloud data warehouses on BigQuery, and automate enterprise DBT pipelines.",
                    PublicationStatus = "Published"
                },
                "Data Science",
                890m,
                21
            ),
            (
                new Course
                {
                    Title = "Cloud-Native Kubernetes, Terraform & DevOps Orchestration",
                    Slug = "kubernetes-devops-cloud",
                    Description = "Provision cloud environments with Terraform, orchestrate containerized microservices in production Kubernetes, and automate GitHub Actions CI/CD.",
                    PublicationStatus = "Published"
                },
                "Cloud & DevOps",
                790m,
                38
            ),
            (
                new Course
                {
                    Title = "Enterprise Cybersecurity, Penetration Testing & DevSecOps",
                    Slug = "cybersecurity-devsecops",
                    Description = "Master hands-on penetration testing, OWASP Top 10 mitigation, Zero-Trust network architecture, SOC threat hunting, and automated DevSecOps pipelines.",
                    PublicationStatus = "Published"
                },
                "Cybersecurity",
                850m,
                28
            )
        };

        foreach (var (course, catName, price, daysUntilStart) in courses)
        {
            await context.Courses.AddAsync(course);

            var courseCategory = new CourseCategory
            {
                CourseId = course.Id,
                CategoryId = categories[catName].Id,
                Sequence = 1
            };
            await context.CourseCategories.AddAsync(courseCategory);

            var offering = new Offering
            {
                Kind = "Course",
                CourseId = course.Id,
                StartsAt = now.AddDays(daysUntilStart),
                EndsAt = now.AddDays(daysUntilStart + 120),
                Price = price,
                Currency = "USD",
                Capacity = 30,
                Status = "Published"
            };
            await context.Offerings.AddAsync(offering);
        }

        await context.SaveChangesAsync();
    }
}
