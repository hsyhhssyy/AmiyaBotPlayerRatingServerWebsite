[Route("api/[controller]")]
public class AccountController : ControllerBase
{
     [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        // 典型返回值
        return Ok(new { message = "用户注册成功" });
    }

    public class LoginModel
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        // 典型返回值
        return Ok(new { Token = "jwt-token-string-here" });
    }

    public class ChangeRoleRequest
    {
        public string? UserId { get; set; }
        public string? NewRole { get; set; }
        public string? OldRole { get; set; }
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "管理员账户")]
    [HttpPost("change-role")]
    public async Task<IActionResult> ChangeUserRole([FromBody] ChangeRoleRequest model)
    {
        // 典型返回值
        return Ok("用户角色已更改为 管理员账户");
    }

    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "管理员账户,开发者账户")]
    [HttpPost("create-secret")]
    public async Task<IActionResult> CreateSecret()
    {
        // 典型返回值
        return Ok(new { ClientId = "some-random-guid", ClientSecret = "some-random-secret", Scope = "TestReadData" });
    }
}

上面是我ASP.NET Core写的后端Api的示例,我需要根据上述api,为我的vue项目添加用户登录,登录后的首页(该首页带有一个侧边栏),未来会向侧边栏添加"Cred管理"项目.
我的后端api的host是
https://amiya-bot-service.hsyhhssyy.net
并且日后可能修改.

接下来我将据此提出一系列问题.

现在请引导我实现用户登录的具体页面


import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'; // 引入刚刚创建的 Login 组件

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // 使用 Login 组件
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

这是我当前的router
我设置了/重定向到login
假如我有一个后端API:Get /api/SKLandCredential/list 可以用来判断token是否有效.
请问我能否调整为,在用户访问/时,如果有有效的token则去主页,如果token失效了则返回登录页?

该主页使用Element Plus，左侧带有一个侧边栏，点击侧边栏时，右侧部分会相应的跳转.
我该使用什么样的文件结构来组织代码最合适?
请给出修改后的主页.


很好，home差不多就这样了，现在开始开发子功能。下面这个内容是我Asp.netCore后端的代码
namespace AmiyaBotPlayerRatingServer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme,Roles = "普通账户")]
    public class SKLandCredentialController : ControllerBase
    {
        [HttpPost("Create")]
        public async Task<IActionResult> CreateCredential([FromBody] SKLandCredentialModel model)
        {
            // 示例返回值: { "Id": "123456", "Message": "Credential successfully created." }
            return Ok(new { Id = "123456", Message = "Credential successfully created." });
        }

        [HttpPut("Update/{credentialId}")]
        [Authorize(Policy = CredentialOwnerPolicy.Name)]
        public async Task<IActionResult> UpdateCredential(string credentialId, [FromBody] SKLandCredentialModel model)
        {
            // 示例返回值: { "Message": "Credential successfully updated." }
            return Ok(new { Message = "Credential successfully updated." });
        }

        [HttpDelete("Delete/{credentialId}")]
        [Authorize(Policy = CredentialOwnerPolicy.Name)]
        public async Task<IActionResult> DeleteCredential(string credentialId)
        {
            // 示例返回值: { "Message": "Credential successfully deleted." }
            return Ok(new { Message = "Credential successfully deleted." });
        }

        [HttpGet("List")]
        public async Task<IActionResult> GetCredentials()
        {
            // 示例返回值: [{ "Id": "123", "Credential": "sample_credential", "Nickname": "sample_nickname", "AvatarUrl": "sample_url" }]
            return Ok(new[] { new { Id = "123", Credential = "sample_credential", Nickname = "sample_nickname", AvatarUrl = "sample_url" } });
        }

        [HttpGet("Details/{credentialId}")]
        [Authorize(Policy = CredentialOwnerPolicy.Name)]
        public async Task<IActionResult> GetCredentialDetails(string credentialId)
        {
            // 示例返回值: { "Id": "123", "Credential": "sample_credential", "Nickname": "sample_nickname", "Avatar": "sample_avatar" }
            return Ok(new { Id = "123", Credential = "sample_credential", Nickname = "sample_nickname", Avatar = "sample_avatar" });
        }
    }
}

现在要根据上面的这个功能,开发一个Cred管理页面(home中的子页面之一)
这个功能是这样的,页面上有用卡片展示的一个个Cred,每个用Avatar和nickname来显示.
此外还含有一个添加按钮.添加按钮按下后会弹出一个对话框来操作,目前对话框内暂时只含有一个文本框,用于输入cred,后续会进行调整.
暂时不处理查看cred详情的功能.
请给出这个页面的代码.