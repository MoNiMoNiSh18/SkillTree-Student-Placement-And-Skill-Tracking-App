cmake_minimum_required(VERSION 3.15)
project(skilltree_backend)

set(CMAKE_CXX_STANDARD 17)

find_package(Drogon CONFIG REQUIRED)

add_executable(skilltree_backend main.cc)

target_link_libraries(skilltree_backend PRIVATE Drogon::Drogon)