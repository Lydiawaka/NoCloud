export async function fetchOneDriveFiles(accessToken: string, path: string) {
  const res = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:${path}:/children`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) throw new Error("Failed to fetch from OneDrive")
  const data = await res.json()

  return data.value.map((item: any) => ({
    id: item.id,
    name: item.name,
    type: item.folder ? "folder" : "file",
    size: item.size || 0,
    path: item.parentReference?.path,
    mimeType: item.file?.mimeType,
  }))
}
