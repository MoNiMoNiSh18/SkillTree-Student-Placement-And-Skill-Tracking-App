#include <iostream>
#include <vector>
#include "httplib.h"
#include "json.hpp"
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


    std::cout << "Server running at http://localhost:8080\n";
    server.listen("0.0.0.0", 8080);
    return 0;
}
