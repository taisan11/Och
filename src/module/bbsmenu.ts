const bbsmenuJsonRaw = {
    "last_modify_string": "2024/07/28(Sun) 22:52:00",
    "last_modify": 1722207120,
    "menu_list": [
      {
        "category_name": "地震",
        "category_content": [
          {
            "category": 1,
            "board_name": "地震headline",
            "url": "https://headline.5ch.net/bbynamazu/",
            "category_name": "地震",
            "directory_name": "bbynamazu",
            "category_order": 1
          },
          {
            "category_order": 2,
            "directory_name": "namazuplus",
            "category_name": "地震",
            "url": "https://egg.5ch.net/namazuplus/",
            "category": 1,
            "board_name": "地震速報"
          },
          {
            "category_order": 3,
            "category_name": "地震",
            "directory_name": "eq",
            "category": 1,
            "board_name": "臨時地震",
            "url": "https://mao.5ch.net/eq/"
          },
          {
            "category_order": 4,
            "url": "https://sora.5ch.net/eqplus/",
            "category": 1,
            "board_name": "臨時地震+",
            "category_name": "地震",
            "directory_name": "eqplus"
          },
          {
            "url": "https://rio2016.5ch.net/lifeline/",
            "category": 1,
            "board_name": "緊急自然災害",
            "category_name": "地震",
            "directory_name": "lifeline",
            "category_order": 5
          }
        ],
        "category_number": "1",
        "category_total": 5
      },
    ],
     "description": "5ch bbsmenu for the json application"
}

export default function bbsmenuJson() {
    return bbsmenuJsonRaw;
}