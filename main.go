package main

import (
	genshindata "GenshinData/genshindata"
	"flag"
	"fmt"
	"net/url"
	"strings"
)

var targetDir = flag.String("targetDir", "./src/assets/genshin", "输出目录 (例: ./src/assets/genshin)")
var localResPath = flag.String("localResPath", "", "本地资源路径 (例: ./src/assets/genshin)")
var repo = flag.String("repo", "https://gitlab.com/Dimbreath/AnimeGameData", "Git 仓库 URL (例: https://gitlab.com/Dimbreath/AnimeGameData)")
var branch = flag.String("branch", "master", "分支名称 (例: master, main)")
var commit = flag.String("commit", "", "Commit ID (例: abc1234def5678, 优先级高于 branch)")
var resUrl = flag.String("resUrl", "", "资源 URL (与 --repo/--branch/--commit 互斥，直接指定完整 URL)")

func init() {
	flag.Parse()
}

// buildRawUrl 根据仓库 URL 和分支名/commit ID 构建 raw 内容 URL
func buildRawUrl(repoUrl string, ref string, isCommit bool) (string, error) {
	// 移除末尾斜杠
	repoUrl = strings.TrimSuffix(repoUrl, "/")

	// 解析 URL
	u, err := url.Parse(repoUrl)
	if err != nil {
		return "", fmt.Errorf("无效的仓库 URL: %v", err)
	}

	// 提取路径部分
	repoPath := u.Path
	repoPath = strings.TrimPrefix(repoPath, "/")

	// 根据主机名判断平台
	if strings.Contains(u.Host, "gitlab") {
		// GitLab: https://gitlab.com/{namespace}/{project}/-/raw/{branch_or_commit}
		return fmt.Sprintf("%s://%s/%s/-/raw/%s", u.Scheme, u.Host, repoPath, ref), nil
	} else if strings.Contains(u.Host, "github") {
		// GitHub: https://raw.githubusercontent.com/{namespace}/{project}/{branch_or_commit}
		return fmt.Sprintf("https://raw.githubusercontent.com/%s/%s", repoPath, ref), nil
	} else {
		// 默认使用 GitLab 格式
		return fmt.Sprintf("%s://%s/%s/-/raw/%s", u.Scheme, u.Host, repoPath, ref), nil
	}
}

func main() {
	// 确定最终的资源 URL
	finalResUrl := *resUrl

	if finalResUrl == "" {
		var builtUrl string
		var err error

		// 优先使用 commit，其次使用 branch
		if *commit != "" {
			builtUrl, err = buildRawUrl(*repo, *commit, true)
			if err != nil {
				fmt.Printf("错误: %v\n", err)
				return
			}
			fmt.Printf("仓库: %s\n", *repo)
			fmt.Printf("Commit ID: %s\n", *commit)
			fmt.Printf("构建的资源 URL: %s\n", builtUrl)
		} else {
			builtUrl, err = buildRawUrl(*repo, *branch, false)
			if err != nil {
				fmt.Printf("错误: %v\n", err)
				return
			}
			fmt.Printf("仓库: %s\n", *repo)
			fmt.Printf("分支: %s\n", *branch)
			fmt.Printf("构建的资源 URL: %s\n", builtUrl)
		}

		finalResUrl = builtUrl
	} else {
		fmt.Printf("使用指定的资源 URL: %s\n", finalResUrl)
	}

	fmt.Printf("输出目录: %s\n", *targetDir)
	fmt.Println("开始处理...")

	genshindata.Generate(*targetDir, *localResPath, finalResUrl)

	fmt.Println("处理完成!")
}
