cmd_Release/obj.target/exiv2.node := flock ./Release/linker.lock g++ -shared -pthread -rdynamic -m64 -lexiv2  -Wl,-soname=exiv2.node -o Release/obj.target/exiv2.node -Wl,--start-group Release/obj.target/exiv2/exiv2node.o -Wl,--end-group -lexiv2