package genshindata

import (
	"bytes"
	"net/http"
	"os"
	"reflect"
	"regexp"
)

//正则
const regexColorToFront = `<color`
const regexColorToFrontReplaced = `<font color`
const regexColorToFrontSalsh = `</color`
const regexColorToFrontSalshReplaced = `</font`
const regexNToBR = `\\n`
const regexNToBRReplaced = `<br>`
const regexColorCode1 = `#99FFFFFF`
const regexColorCode1Replaced = `#FF6600`
const regexColorCode2 = `#FFD780FF`
const regexColorCode2Replaced = `#FF6600`
const regexColorCode3 = `#80C0FFFF`
const regexColorCode3Replaced = `#FF6600`
const regexColorCode4 = `#FF9999FF`
const regexColorCode4Replaced = `#FF6600`
const regexColorCode5 = `#80FFD7FF`
const regexColorCode5Replaced = `#FF6600`
const regexColorCode6 = `#FFACFFFF`
const regexColorCode6Replaced = `#FF6600`
const regexColorCode7 = `#FFE699FF`
const regexColorCode7Replaced = `#FF6600`

//正则
var regxList = []*regexp.Regexp{
	regexp.MustCompile(regexColorToFront),
	regexp.MustCompile(regexColorToFrontSalsh),
	regexp.MustCompile(regexNToBR),
	regexp.MustCompile(regexColorCode1),
	regexp.MustCompile(regexColorCode2),
	regexp.MustCompile(regexColorCode3),
	regexp.MustCompile(regexColorCode4),
	regexp.MustCompile(regexColorCode5),
	regexp.MustCompile(regexColorCode6),
	regexp.MustCompile(regexColorCode7),
}
var regxReplaceList = []string{
	regexColorToFrontReplaced,
	regexColorToFrontSalshReplaced,
	regexNToBRReplaced,
	regexColorCode1Replaced,
	regexColorCode2Replaced,
	regexColorCode3Replaced,
	regexColorCode4Replaced,
	regexColorCode5Replaced,
	regexColorCode6Replaced,
	regexColorCode7Replaced,
}

//文件定义
type FILETYPE int

//文件类型
const (
	typeDir FILETYPE = iota
	typeJs
)

//文件信息
type FILEINFO struct {
	path  string
	class FILETYPE
	save  bool
}

//默认Buff大小
const defaultBuffSize = 15000

//从URL读取JSON(Buffer)
func getJSON(url string) (buf *bytes.Buffer, err error) {
	rp, err := http.Get(url)
	if err != nil {
		return
	}
	defer rp.Body.Close()
	return readBody(rp)
}

//从Response解析到Buffer
func readBody(rp *http.Response) (buf *bytes.Buffer, err error) {
	defer func() {
		r := recover()
		if r == nil {
			return
		} else if er, ok := r.(error); ok {
			err = er
			return
		}
		panic(r)
	}()
	buf = bytes.NewBuffer(make([]byte, 0, defaultBuffSize))
	buf.ReadFrom(rp.Body)
	return buf, nil
}

//写入文件
func writeToFile(path string, content *bytes.Buffer) error {
	f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0777)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = content.WriteTo(f)
	return err
}

//读取文件
func readFromFile(fileName string, content *bytes.Buffer) error {
	f, err := os.Open(fileName)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = content.ReadFrom(f)
	return err
}

//深拷贝Struct
func copyStruct(dst, src interface{}) {
	tempA := reflect.ValueOf(dst).Elem()
	tempB := reflect.ValueOf(src).Elem()
	for i := 0; i < tempA.NumField(); i++ {
		name := tempB.Type().Field(i).Name
		value := tempB.FieldByName(name)
		tempA.FieldByName(name).Set(value)
	}
}

//正则替换
func htmlColorTag(origin string) string {
	var res = origin
	for i := range regxList {
		res = regxList[i].ReplaceAllString(res, regxReplaceList[i])
	}
	return res
}
