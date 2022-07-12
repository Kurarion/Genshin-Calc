package main

import (
	genshindata "GenshinData/genshindata"
	"flag"
	"fmt"
)

var targetDir = flag.String("targetDir", "./src/assets/genshin", "example ./src/assets/genshin")

func main() {
	flag.Parse()
	fmt.Println("Path:", *targetDir)
	fmt.Println("Start!")
	genshindata.Generate(*targetDir)
	fmt.Println("End!")
}
