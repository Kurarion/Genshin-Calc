package main

import (
	genshindata "GenshinData/genshindata"
	"flag"
	"fmt"
)

var targetDir = flag.String("targetDir", "./src/assets/genshin", "example ./src/assets/genshin")
var localResPath = flag.String("localResPath", "", "example ./src/assets/genshin")
var resUrl = flag.String("resUrl", "https://raw.githubusercontent.com/Dimbreath/GenshinData/master", "example https://raw.githubusercontent.com/Dimbreath/GenshinData/master")

func init() {
	flag.Parse()
}

func main() {
	fmt.Println("Path:", *targetDir)
	fmt.Println("Start!")
	genshindata.Generate(*targetDir, *localResPath, *resUrl)
	fmt.Println("End!")
}
