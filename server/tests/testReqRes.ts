export const test1req = `
	query {
		branches (username: "maneesht" repo: "todo-app"){
			id
		}
	}
`;
export const test1res = {
	"data": {
		"branches": [
			{
				"id": "cleanup"
			},
			{
				"id": "master"
			}
		]
	}
};
export const test1res2 = {
	"data": {
		"branches": [
			{
				"id": "master"
			},
			{
				"id": "cleanup"
			}
		]
	}
};

export const test2req = `query {
  branches (username: "maneesht" repo: "todo-app"){
    id
    commits {
      sha
    }
  }
}`;

export const test2res = {
  "data": {
    "branches": [
      {
        "id": "master",
        "commits": [
          {
            "sha": "515303528685e1ff575824ab6c187fef19e07334"
          },
          {
            "sha": "3d1c24c101b7e3cb9755acc6e1cf03a137c3adc5"
          },
          {
            "sha": "6ba70d5827147ac91ee6e16196d625971d5e5790"
          },
          {
            "sha": "f61f2bc354c25b68869e51ac4fa0cf756a991072"
          },
          {
            "sha": "4c88e185398f6f165880188324605cb7fc6a5a39"
          },
          {
            "sha": "d15052a8b84fbbebf07e1aea925f09915a8c9d45"
          }
        ]
      },
      {
        "id": "cleanup",
        "commits": [
          {
            "sha": "85e6555bdcbc76bcb1f39d5eb7d8d1573e8913a5"
          },
          {
            "sha": "6451e49de78ef093a582198ec934bac9b0d39d45"
          },
          {
            "sha": "bd816e0fc25081eb71e8f52810835872ce617ed2"
          },
          {
            "sha": "6ba70d5827147ac91ee6e16196d625971d5e5790"
          },
          {
            "sha": "f61f2bc354c25b68869e51ac4fa0cf756a991072"
          },
          {
            "sha": "4c88e185398f6f165880188324605cb7fc6a5a39"
          },
          {
            "sha": "d15052a8b84fbbebf07e1aea925f09915a8c9d45"
          }
        ]
      }
    ]
  }
};

export const test2res2 = {
  "data": {
    "branches": [
      {
        "id": "cleanup",
        "commits": [
          {
            "sha": "85e6555bdcbc76bcb1f39d5eb7d8d1573e8913a5"
          },
          {
            "sha": "6451e49de78ef093a582198ec934bac9b0d39d45"
          },
          {
            "sha": "bd816e0fc25081eb71e8f52810835872ce617ed2"
          },
          {
            "sha": "6ba70d5827147ac91ee6e16196d625971d5e5790"
          },
          {
            "sha": "f61f2bc354c25b68869e51ac4fa0cf756a991072"
          },
          {
            "sha": "4c88e185398f6f165880188324605cb7fc6a5a39"
          },
          {
            "sha": "d15052a8b84fbbebf07e1aea925f09915a8c9d45"
          }
        ]
      },
      {
        "id": "master",
        "commits": [
          {
            "sha": "515303528685e1ff575824ab6c187fef19e07334"
          },
          {
            "sha": "3d1c24c101b7e3cb9755acc6e1cf03a137c3adc5"
          },
          {
            "sha": "6ba70d5827147ac91ee6e16196d625971d5e5790"
          },
          {
            "sha": "f61f2bc354c25b68869e51ac4fa0cf756a991072"
          },
          {
            "sha": "4c88e185398f6f165880188324605cb7fc6a5a39"
          },
          {
            "sha": "d15052a8b84fbbebf07e1aea925f09915a8c9d45"
          }
        ]
      }
    ]
  }
}

export const test3req = `query	{
  branches (username: "maneesht" repo: "quiz-app"){
    id
    commits {
      sha
      author
      message
      parentSha
    }
  }
}`;

export const test3res = {
  "data": {
    "branches": [
      {
        "id": "master",
        "commits": [
          {
            "sha": "ee847e34adc844304a05172873a98062cacf8b3e",
            "author": "Maneesh Tewani",
            "message": "Fixed error with Subscription",
            "parentSha": "d80cdfc8d0c04a103ca40574f968be659df38d13"
          },
          {
            "sha": "d80cdfc8d0c04a103ca40574f968be659df38d13",
            "author": "Maneesh Tewani",
            "message": "Major state and design overhaul",
            "parentSha": "19789cddb26844c1556d8aa4e6c4476d8e8861c7"
          },
          {
            "sha": "19789cddb26844c1556d8aa4e6c4476d8e8861c7",
            "author": "Maneesh Tewani",
            "message": "Updated REAMDE",
            "parentSha": "01f1663604f7d159e75f470bec16960f17aa2f92"
          },
          {
            "sha": "01f1663604f7d159e75f470bec16960f17aa2f92",
            "author": "Maneesh Tewani",
            "message": "Finished with version 1 of QuizApp",
            "parentSha": "6256442fa231548a3bd1c6a691796aab38bea936"
          },
          {
            "sha": "6256442fa231548a3bd1c6a691796aab38bea936",
            "author": "angular-cli",
            "message": "chore: initial commit from angular-cli",
            "parentSha": ""
          }
        ]
      }
    ]
  }
};

export const test4req = `query	{
  branches (username: "maneesht" repo: "todo-app" branchName: "master"){
    commits {
      sha
      author
      message
      parentSha
    }
  }
}`;

export const test4res = {
  "data": {
    "branches": [
      {
        "commits": [
          {
            "sha": "515303528685e1ff575824ab6c187fef19e07334",
            "author": "Maneesh Tewani",
            "message": "Separated todo app",
            "parentSha": "3d1c24c101b7e3cb9755acc6e1cf03a137c3adc5"
          },
          {
            "sha": "3d1c24c101b7e3cb9755acc6e1cf03a137c3adc5",
            "author": "Maneesh Tewani",
            "message": "Modularized State Management",
            "parentSha": "6ba70d5827147ac91ee6e16196d625971d5e5790"
          },
          {
            "sha": "6ba70d5827147ac91ee6e16196d625971d5e5790",
            "author": "Maneesh Tewani",
            "message": "Fixed layout and socket update",
            "parentSha": "f61f2bc354c25b68869e51ac4fa0cf756a991072"
          },
          {
            "sha": "f61f2bc354c25b68869e51ac4fa0cf756a991072",
            "author": "Maneesh Tewani",
            "message": "Persistent Firebase storage now works.",
            "parentSha": "4c88e185398f6f165880188324605cb7fc6a5a39"
          },
          {
            "sha": "4c88e185398f6f165880188324605cb7fc6a5a39",
            "author": "Maneesh Tewani",
            "message": "Initial Commit",
            "parentSha": "d15052a8b84fbbebf07e1aea925f09915a8c9d45"
          },
          {
            "sha": "d15052a8b84fbbebf07e1aea925f09915a8c9d45",
            "author": "angular-cli",
            "message": "chore: initial commit from angular-cli",
            "parentSha": ""
          }
        ]
      }
    ]
  }
};
