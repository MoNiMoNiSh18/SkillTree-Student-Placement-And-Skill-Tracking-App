#include <drogon/drogon.h>
#include <vector>

struct Student {
    int id;
    std::string name;
    int skill_level;
};

std::vector<Student> students = {
    {1, "Rahul", 3},
    {2, "Rohan", 4}
};

int main() {

 drogon::app().registerHandler(
    "/students",
    [](const drogon::HttpRequestPtr &req,
       std::function<void (const drogon::HttpResponsePtr &)> &&callback)
    {
        try {
            auto jsonBody = req->getJsonObject();

            if (!jsonBody) {
                auto resp = drogon::HttpResponse::newHttpResponse();
                resp->setStatusCode(drogon::k400BadRequest);
                resp->setBody("Invalid JSON");
                callback(resp);
                return;
            }

            Student new_student;
            new_student.id = students.size() + 1;
            new_student.name = (*jsonBody)["name"].asString();
            new_student.skill_level = (*jsonBody)["skill_level"].asInt();

            students.push_back(new_student);

            Json::Value res;
            res["message"] = "Student added";

            auto resp = drogon::HttpResponse::newHttpJsonResponse(res);
            callback(resp);
        }
        catch (...) {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setStatusCode(drogon::k400BadRequest);
            resp->setBody("Error processing request");
            callback(resp);
        }
    },
    {drogon::Post}
);

drogon::app().registerHandler(
    "/students/{1}",
    [](const drogon::HttpRequestPtr &req,
       std::function<void (const drogon::HttpResponsePtr &)> &&callback,
       int id)
    {
        try {
            auto jsonBody = req->getJsonObject();

            if (!jsonBody) {
                auto resp = drogon::HttpResponse::newHttpResponse();
                resp->setStatusCode(drogon::k400BadRequest);
                resp->setBody("Invalid JSON");
                callback(resp);
                return;
            }

            for (auto &s : students) {
                if (s.id == id) {

                    if (!jsonBody->isMember("name") || !jsonBody->isMember("skill_level")) {
                        auto resp = drogon::HttpResponse::newHttpResponse();
                        resp->setStatusCode(drogon::k400BadRequest);
                        resp->setBody("Missing fields");
                        callback(resp);
                        return;
                    }

                    s.name = (*jsonBody)["name"].asString();
                    s.skill_level = (*jsonBody)["skill_level"].asInt();

                    Json::Value res;
                    res["message"] = "Student updated";

                    auto resp = drogon::HttpResponse::newHttpJsonResponse(res);
                    callback(resp);
                    return;
                }
            }

            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setStatusCode(drogon::k404NotFound);
            resp->setBody("Student not found");
            callback(resp);

        } catch (...) {
            auto resp = drogon::HttpResponse::newHttpResponse();
            resp->setStatusCode(drogon::k400BadRequest);
            resp->setBody("Error");
            callback(resp);
        }
    },
    {drogon::Put}
);

drogon::app().registerHandler(
    "/students/{1}",
    [](const drogon::HttpRequestPtr &req,
       std::function<void (const drogon::HttpResponsePtr &)> &&callback,
       int id)
    {
        for (auto it = students.begin(); it != students.end(); ++it) {
            if (it->id == id) {
                students.erase(it);

                Json::Value res;
                res["message"] = "Student deleted";

                auto resp = drogon::HttpResponse::newHttpJsonResponse(res);
                callback(resp);
                return;
            }
        }

        auto resp = drogon::HttpResponse::newHttpResponse();
        resp->setStatusCode(drogon::k404NotFound);
        resp->setBody("Student not found");
        callback(resp);
    },
    {drogon::Delete}
);

    drogon::app().addListener("0.0.0.0", 8848);
    drogon::app().run();
}