#include <iostream>
#include <vector>
#include "httplib.h"
#include "json.hpp"
#include <algorithm>
using json=nlohmann::json;

struct Student{
    int id;
    std::string name;
    int skill_level;
};

std::vector<Student> students={
    {1,"Rahul",3},
    {2,"Rohan",4}
};

int main() {
    httplib::Server server;
    server.Get("/",[](const httplib::Request&,httplib::Response& res){
        res.set_content("Welcome to SkillTree Backend","text/plain");
    });

    server.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("SkillTree Backend is Healthy", "text/plain");
    });

    server.Get("/students",[](const httplib::Request&,httplib::Response& res){
        json result=json::array();
            for(const auto& s:students){
                result.push_back({
                    {"id",s.id},
                    {"name",s.name},
                    {"skill_level",s.skill_level}
                });
            }
        res.set_content(result.dump(4),"application/json");
    });

    server.Post("/students", [](const httplib::Request& req, httplib::Response& res) {

    try {
        auto body = json::parse(req.body);

        Student new_student;
        new_student.id = students.size() + 1;
        new_student.name = body["name"];
        new_student.skill_level = body["skill_level"];

        students.push_back(new_student);

        res.set_content("{\"message\": \"Student added successfully\"}", "application/json");
    }
    catch (...) {
        res.status = 400;
        res.set_content("{\"error\": \"Invalid JSON\"}", "application/json");
    }
});

   server.Delete(R"(/students/(\d+))", [](const httplib::Request& req, httplib::Response& res) {
    try {
        if (req.matches.size() < 2) {
            res.status = 400;
            res.set_content("{\"error\": \"Invalid ID\"}", "application/json");
            return;
        }

        int id = std::stoi(req.matches[1]);

        auto it = std::remove_if(students.begin(), students.end(),
            [id](const Student& s) {
                return s.id == id;
            });

        if (it != students.end()) {
            students.erase(it, students.end());
            res.set_content("{\"message\": \"Student deleted\"}", "application/json");
        } else {
            res.status = 404;
            res.set_content("{\"error\": \"Student not found\"}", "application/json");
        }
    }
    catch (...) {
        res.status = 400;
        res.set_content("{\"error\": \"Invalid request\"}", "application/json");
    }
});

server.Put(R"(/students/(\d+))", [](const httplib::Request& req, httplib::Response& res) {
    try {
        if (req.matches.size() < 2) {
            res.status = 400;
            res.set_content("{\"error\":\"Invalid ID\"}", "application/json");
            return;
        }

        int id = std::stoi(req.matches[1]);
        auto body = json::parse(req.body);

        for (auto& s : students) {
            if (s.id == id) {

                // Validation
                if (!body.contains("name") || !body.contains("skill_level")) {
                    res.status = 400;
                    res.set_content("{\"error\":\"Missing fields\"}", "application/json");
                    return;
                }

                if (body["name"].get<std::string>().empty() ||
                    body["skill_level"].get<int>() < 0) {
                    res.status = 400;
                    res.set_content("{\"error\":\"Invalid data\"}", "application/json");
                    return;
                }

                s.name = body["name"];
                s.skill_level = body["skill_level"];

                res.set_content("{\"message\":\"Student updated\"}", "application/json");
                return;
            }
        }

        res.status = 404;
        res.set_content("{\"error\":\"Student not found\"}", "application/json");
    }
    catch (...) {
        res.status = 400;
        res.set_content("{\"error\":\"Invalid JSON\"}", "application/json");
    }
});


    std::cout << "Server running at http://localhost:9090\n";
    if (!server.listen("0.0.0.0", 9090)) {
    std::cerr << "Failed to start server on port 9090\n";
}
    return 0;
}
