export class Tutorials {
    
    static getTutorial(tutorialNum: number) {
        switch (tutorialNum) {
            case 0:
                return Tutorials.getRepo('basicgitrepo')
        }
    }

    static getRepo(name: string) {
        let repo = new Promise(() => {
            
        }).then((data) => {

        }).catch()
    }

    static getBranch(name: string, branch: string) {

    }
}