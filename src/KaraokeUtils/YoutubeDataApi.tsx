
export interface YoutubeResult {
    items : {
        kind: string,
        etag: string,
        id: {
            kind: string,
            videoId: string
        },
        snippet: {
            title: string,
            thumbnails: {
                default : {
                    url : string,
                    width: number,
                    height: number
                }
            }
        }
    }[]
}

export default function YoutubeAPIFetch(query: string) {

    const optionParams = {
        key : "AIzaSyD_0KEgU9RuaavJVe-XzuDpSDK_8dG1M5U",
        q: query,
        channelId: "UCDqaUIUSJP5EVMEI178Zfag",
        part:"snippet",
        maxResults:20,
    }
    let url = "https://www.googleapis.com/youtube/v3/search?";
    for(let [key, value] of Object.entries(optionParams)) {
        url+=key+"="+ value+"&";
    }
    url=url.substr(0, url.length-1);
    return fetch(url)
    .then<YoutubeResult>(response => response.json())
}
