# 超链接前端集成设计文档

## 1. 系统架构

### 1.1 整体架构

超链接功能将采用以下架构：

```
后端数据生成 -> 数据服务 -> 超链接处理服务 -> 超链接组件 -> 用户界面
```

1. **后端数据生成**：修改Go代码，保留超链接标记并生成正确的数据结构
2. **数据服务**：使用现有的GenshinDataService加载和管理数据
3. **超链接处理服务**：新建的服务，负责解析超链接标记和获取内容
4. **超链接组件**：新建的Angular组件，负责显示超链接和处理交互
5. **用户界面**：现有的显示组件，集成超链接功能

### 1.2 数据流

```
原始文本 -> 正则表达式处理 -> 超链接标记解析 -> 内容获取 -> 组件渲染 -> 用户交互
```

## 2. 后端实现设计

### 2.1 正则表达式修改

当前的正则表达式处理将超链接标记替换为空白：

```go
const regexLayout3 = `\{LINK#(.*?)\}`
const regexLayout3Replaced = ``
const regexLayout4 = `\{/LINK}`
const regexLayout4Replaced = ``
```

修改后的正则表达式处理将保留超链接标记：

```go
// 保留超链接标记，但转换为HTML格式以便前端处理
const regexLayout3 = `\{LINK#(.*?)\}`
const regexLayout3Replaced = `<span class="hyperlink" data-link-id="$1">`
const regexLayout4 = `\{/LINK}`
const regexLayout4Replaced = `</span>`
```

### 2.2 数据结构修正

#### 2.2.1 GenshinHyperLinkNameData 修正

当前结构：
```go
type GenshinHyperLinkNameData struct {
    TextMapId                 string   `json:"textMapId"`
    TextMapContentTextMapHash uint64   `json:"textMapContentTextMapHash"`
    ParamTypes                []string `json:"paramTypes"`
}
```

修正后结构：
```go
type GenshinHyperLinkNameData struct {
    Id                        string   `json:"id"`
    TextMapContentHash        uint64   `json:"textMapContentHash"`
    Content                   map[string]string `json:"content"`
    ParamTypes                []string `json:"paramTypes"`
}
```

#### 2.2.2 GenshinManualTextMapData 修正

当前结构：
```go
type GenshinManualTextMapData struct {
    Id                        uint64 `json:"id"`
    TextMapContentTextMapHash uint64 `json:"textMapContentTextMapHash"`
}
```

修正后结构：
```go
type GenshinManualTextMapData struct {
    Id                 uint64            `json:"id"`
    TextMapContentHash uint64            `json:"textMapContentHash"`
    Content            map[string]string `json:"content"`
}
```

#### 2.2.3 GenshinPushTipsData 和 GenshinTutorialDetailData 修正

类似地，修正这两个结构以包含多语言内容映射。

### 2.3 数据处理流程

1. 从JSON文件读取原始数据
2. 解析TextMapHash到实际文本的映射
3. 构建包含多语言内容的数据结构
4. 应用正则表达式处理，转换超链接标记
5. 生成最终的JSON数据文件

## 3. 前端实现设计

### 3.1 前端数据加载架构

#### 3.1.1 数据加载流程

```
应用启动 -> app.component.ts -> 加载JSON文件 -> GenshinDataService -> HyperlinkService
```

1. **应用启动**：`app.component.ts` 中的 `ngOnInit` 方法启动数据加载
2. **JSON文件加载**：通过 `HttpService` 从 assets 目录加载 JSON 文件
3. **数据服务初始化**：将加载的数据传递给 `GenshinDataService` 的静态方法
4. **超链接服务初始化**：`HyperlinkService` 从 `GenshinDataService` 获取数据

#### 3.1.2 常量定义

在 `src/app/shared/const/const.ts` 中添加：

```typescript
// 超链接相关常量
static readonly SYS_JSON_DATA_GENSHIN_HYPERLINK = 'DATA_GENSHIN_HYPERLINK';
static readonly SYS_JSON_DATA_GENSHIN_MANUAL_TEXTMAP = 'DATA_GENSHIN_MANUAL_TEXTMAP';
static readonly SYS_JSON_DATA_GENSHIN_PUSH_TIPS = 'DATA_GENSHIN_PUSH_TIPS';
static readonly SYS_JSON_DATA_GENSHIN_TUTORIAL_DETAIL = 'DATA_GENSHIN_TUTORIAL_DETAIL';

// 文件路径映射
static readonly SYS_JSON_URLS: Record<string, string> = {
  // 现有映射...
  [this.SYS_JSON_DATA_GENSHIN_HYPERLINK]: 'assets/genshin/hyperlink_map.json',
  [this.SYS_JSON_DATA_GENSHIN_MANUAL_TEXTMAP]: 'assets/genshin/manual_textmap_map.json',
  [this.SYS_JSON_DATA_GENSHIN_PUSH_TIPS]: 'assets/genshin/push_tips_map.json',
  [this.SYS_JSON_DATA_GENSHIN_TUTORIAL_DETAIL]: 'assets/genshin/tutorial_detail_map.json',
};

// 数据列表
static readonly SYS_JSON_LIST: string[] = [
  // 现有列表...
  this.SYS_JSON_DATA_GENSHIN_HYPERLINK,
  this.SYS_JSON_DATA_GENSHIN_MANUAL_TEXTMAP,
  this.SYS_JSON_DATA_GENSHIN_PUSH_TIPS,
  this.SYS_JSON_DATA_GENSHIN_TUTORIAL_DETAIL,
];
```

#### 3.1.3 应用初始化修改

在 `src/app/app.component.ts` 中添加：

```typescript
initializeAppFactory(httpService: HttpService): Promise<any> {
  let promiseList: Promise<any>[] = [];
  
  // 现有数据加载...
  
  // 添加超链接数据加载
  promiseList.push(
    lastValueFrom(
      httpService
        .getSystemData(
          Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_HYPERLINK],
          'json',
          this.jsonDownloadStatus,
          Const.SYS_JSON_DATA_GENSHIN_HYPERLINK,
        )
        .pipe(
          tap((data) => {
            GenshinDataService.initHyperlinkData(data);
          }),
        ),
    ),
  );
  
  // 添加术语数据加载
  promiseList.push(
    lastValueFrom(
      httpService
        .getSystemData(
          Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_MANUAL_TEXTMAP],
          'json',
          this.jsonDownloadStatus,
          Const.SYS_JSON_DATA_GENSHIN_MANUAL_TEXTMAP,
        )
        .pipe(
          tap((data) => {
            GenshinDataService.initManualTextMapData(data);
          }),
        ),
    ),
  );
  
  // 添加教学提示数据加载
  promiseList.push(
    lastValueFrom(
      httpService
        .getSystemData(
          Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_PUSH_TIPS],
          'json',
          this.jsonDownloadStatus,
          Const.SYS_JSON_DATA_GENSHIN_PUSH_TIPS,
        )
        .pipe(
          tap((data) => {
            GenshinDataService.initPushTipsData(data);
          }),
        ),
    ),
  );
  
  // 添加教学详细内容数据加载
  promiseList.push(
    lastValueFrom(
      httpService
        .getSystemData(
          Const.SYS_JSON_URLS[Const.SYS_JSON_DATA_GENSHIN_TUTORIAL_DETAIL],
          'json',
          this.jsonDownloadStatus,
          Const.SYS_JSON_DATA_GENSHIN_TUTORIAL_DETAIL,
        )
        .pipe(
          tap((data) => {
            GenshinDataService.initTutorialDetailData(data);
          }),
        ),
    ),
  );
  
  return Promise.all(promiseList).then(() => {
    GenshinDataService.initMonsterData();
  });
}
```

#### 3.1.4 数据服务扩展

在 `src/app/shared/service/genshin/genshin-data.service.ts` 中添加：

```typescript
export class GenshinDataService {
  // 现有静态变量...
  
  // 新增超链接相关静态变量
  static dataHyperlinkMap: Record<string, any>;
  static dataManualTextMap: Record<string, any>;
  static dataPushTipsMap: Record<string, any>;
  static dataTutorialDetailMap: Record<string, any>;
  
  // 新增初始化方法
  static initHyperlinkData(data: any) {
    this.dataHyperlinkMap = data;
  }
  
  static initManualTextMapData(data: any) {
    this.dataManualTextMap = data;
  }
  
  static initPushTipsData(data: any) {
    this.dataPushTipsMap = data;
  }
  
  static initTutorialDetailData(data: any) {
    this.dataTutorialDetailMap = data;
  }
  
  // 新增获取方法
  getHyperlinkData(id: string) {
    return this.dataHyperlinkMap?.[id];
  }
  
  getManualTextMapData(id: string) {
    return this.dataManualTextMap?.[id];
  }
  
  getPushTipsData(id: string) {
    return this.dataPushTipsMap?.[id];
  }
  
  getTutorialDetailData(id: string) {
    return this.dataTutorialDetailMap?.[id];
  }
}
```

### 3.2 超链接处理服务

#### 3.2.1 服务接口

```typescript
interface HyperlinkContent {
  id: string;
  content: Record<TYPE_SYS_LANG, string>;
  paramTypes?: string[];
}

interface HyperlinkService {
  // 解析文本中的超链接标记
  parseHyperlinks(text: string): string;
  
  // 获取超链接内容
  getHyperlinkContent(id: string): HyperlinkContent | null;
  
  // 初始化超链接数据
  initHyperlinkData(): Promise<void>;
}
```

#### 3.2.2 实现细节

```typescript
@Injectable({
  providedIn: 'root'
})
export class HyperlinkService {
  private hyperlinkData: Record<string, HyperlinkContent> = {};
  private manualTextMapData: Record<string, HyperlinkContent> = {};
  
  constructor(private genshinDataService: GenshinDataService) {}
  
  async initHyperlinkData(): Promise<void> {
    // 从 GenshinDataService 获取数据
    this.hyperlinkData = this.genshinDataService.dataHyperlinkMap || {};
    this.manualTextMapData = this.genshinDataService.dataManualTextMap || {};
  }
  
  parseHyperlinks(text: string): string {
    // 解析 {LINK#id}...{/LINK} 标记
    // 转换为HTML格式，添加必要的属性和类
  }
  
  getHyperlinkContent(id: string): HyperlinkContent | null {
    // 从缓存中获取超链接内容
    // 如果不存在，尝试从术语数据中获取
  }
}
```

### 3.2 超链接组件

#### 3.2.1 组件接口

```typescript
interface HyperlinkComponent {
  @Input() linkId: string;
  @Input() content: string;
  @Output() hover: EventEmitter<string>;
}
```

#### 3.2.2 组件实现

```typescript
@Component({
  selector: 'app-hyperlink',
  templateUrl: './hyperlink.component.html',
  styleUrls: ['./hyperlink.component.css']
})
export class HyperlinkComponent implements OnInit {
  @Input() linkId: string;
  @Input() content: string;
  
  hyperlinkContent: HyperlinkContent | null = null;
  
  constructor(private hyperlinkService: HyperlinkService) {}
  
  ngOnInit(): void {
    this.hyperlinkContent = this.hyperlinkService.getHyperlinkContent(this.linkId);
  }
  
  onHover(): void {
    // 触发悬停事件
  }
}
```

#### 3.2.3 组件模板

```html
<span class="hyperlink-text" 
      (mouseenter)="onHover()"
      [matTooltip]="hyperlinkContent?.content[currentLanguage] || ''"
      matTooltipPosition="above">
  {{ content }}
</span>
```

#### 3.2.4 组件样式

```css
.hyperlink-text {
  color: #1976d2;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 500;
}

.hyperlink-text:hover {
  color: #0d47a1;
  text-decoration: none;
}
```

### 3.3 现有组件修改

#### 3.3.1 修改技能描述显示

在 `talent.component.html` 中：

```html
<!-- 原来的代码 -->
<span [innerHTML]="$any(this.data.skills[skill]).desc[currentLanguage]"></span>

<!-- 修改后的代码 -->
<span [innerHTML]="parseHyperlinks($any(this.data.skills[skill]).desc[currentLanguage])"></span>
```

在组件类中添加：

```typescript
import { HyperlinkService } from 'src/app/shared/service/hyperlink.service';

constructor(private hyperlinkService: HyperlinkService) {}

parseHyperlinks(text: string): string {
  return this.hyperlinkService.parseHyperlinks(text);
}
```

#### 3.3.2 修改其他显示组件

类似地修改其他显示技能描述、武器特效等文本的组件。

## 4. 性能优化

### 4.1 数据缓存

1. 超链接数据缓存：在服务初始化时加载所有超链接数据并缓存
2. 内容缓存：解析后的HTML内容也可以缓存，避免重复解析
3. 懒加载：只有当超链接进入视口时才加载详细内容

### 4.2 DOM操作优化

1. 减少DOM操作：使用Angular的变更检测策略
2. 虚拟滚动：对于大量超链接的情况，考虑使用虚拟滚动
3. 事件委托：使用事件委托减少事件监听器数量

## 5. 错误处理

### 5.1 数据错误处理

1. 超链接ID不存在：显示默认文本或错误提示
2. 内容为空：显示默认文本或跳过显示
3. 网络请求失败：使用降级方案，显示原始标记

### 5.2 用户体验优化

1. 加载状态：显示加载指示器
2. 错误提示：友好的错误提示信息
3. 降级方案：在超链接功能不可用时，显示原始文本

## 6. 测试策略

### 6.1 单元测试

1. 超链接服务测试：测试解析逻辑和数据获取
2. 超链接组件测试：测试组件渲染和交互
3. 集成测试：测试服务与组件的集成

### 6.2 端到端测试

1. 用户交互测试：测试鼠标悬停和点击行为
2. 多语言测试：测试不同语言环境下的显示
3. 性能测试：测试大量超链接情况下的性能

### 6.3 兼容性测试

1. 浏览器兼容性：测试主流浏览器的兼容性
2. 设备兼容性：测试不同设备上的显示效果
3. 可访问性测试：确保符合可访问性标准