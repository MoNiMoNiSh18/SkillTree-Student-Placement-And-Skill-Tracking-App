#include <iostream>
#include "httplib.h"

int main() {
    httplib::Server server;
    server.Get("/",[](const httplib::Request&,httplib::Response& res){
        res.set_content("Welcome to SkillTree Backend","text/plain");
    });
    server.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("SkillTree Backend is Healthy", "text/plain");
    });
    std::cout << "Server running at http://localhost:8080\n";
    server.listen("0.0.0.0", 8080);
    return 0;
}
