package main

import (
	genshindata "GenshinData/genshindata"
	"flag"
	"fmt"
)

var targetDir = flag.String("targetDir", "./src/assets/genshin", "example ./src/assets/genshin")
var localResPath = flag.String("localResPath", "", "example ./src/assets/genshin")

func init() {
	flag.Parse()
}

func main() {
	fmt.Println("Path:", *targetDir)
	fmt.Println("Start!")
	genshindata.Generate(*targetDir, *localResPath)
	fmt.Println("End!")
}
