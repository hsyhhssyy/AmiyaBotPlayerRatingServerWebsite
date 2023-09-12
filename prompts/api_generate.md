import axios from 'axios';

// 获取 Cred 列表
export const getCredentials = async () => {
  try {
    const response = await axios.get('/api/SKLandCredential/List', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt-token')}`, // 或者其他存储 token 的方式
      },
    });
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching data: ', error);
  }
};

请仿照上面这个ts代码,写出下面三个AspNetCore Action的api

Class的Route是 /api/account/

public class CreateClientModel
{
    public string FriendlyName { get; set; }
    public string IconBase64 { get; set; }
}

[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
[Authorize(Roles = "管理员账户,开发者账户")]
[HttpPost("create-client")]
public async Task<IActionResult> CreateClient([FromBody] CreateClientModel model)
{
    var descriptor = new OpenIddictApplicationDescriptor
    {
        ClientId = Guid.NewGuid().ToString("N"),
        ClientSecret = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)),
        // 其他代码...
    };

    await _oauthManager.CreateAsync(descriptor);

    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    _dbContext.ClientInfos.Add(new ClientInfo
    {
        ClientId = descriptor.ClientId,
        FriendlyName = model.FriendlyName,
        IconBase64 = model.IconBase64,
        UserId = userId
    });
    await _dbContext.SaveChangesAsync();

    return Ok(new
    {
        ClientId = descriptor.ClientId,
        FriendlyName = model.FriendlyName,
        IconBase64 = model.IconBase64
    });
}
[HttpGet("list-clients")]
public async Task<IActionResult> ListClients()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var clients = await _dbContext.ClientInfos.Where(c => c.UserId == userId).ToListAsync();
    return Ok(clients);
}
[HttpGet("get-client/{clientId}")]
public async Task<IActionResult> GetClient(string clientId)
{
    var client = await _dbContext.ClientInfos.FirstOrDefaultAsync(c => c.ClientId == clientId);
    if (client == null)
    {
        return NotFound();
    }
    return Ok(client);
}
