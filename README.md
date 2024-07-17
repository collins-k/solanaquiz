# SOLQuiz
[project-demo]: solquiz.gif
![project-demo]
`SOLQuiz`  is a decentralized quiz game built on the Solana blockchain. Users can create quizzes where other participants can guess the correct answer.

Live Demo [SOLQuiz](https://solanaquizgame.vercel.app)

### Improvement
- Track the user's score while playing the game
- Add reward mechanism for incentivising players
- Add dashboard to track the address with the best score
- Add filtering/pagination to retrieve only unanswered quizzes in chunks
- Add page that allows the user to select/create specific quizzes (e.g. by category)
- Add page that allows the user to manually create quizzes
- Add edit page for manually created quizzes

### Remarks
- We are using [Open Trivia DB](https://opentdb.com/) for generating quizzes
- SOLQuiz is only deploy on the devnet

## Quick start

The first things you need to do are cloning this repository and installing its
dependencies:

```sh
git clone https://github.com/School-of-Solana/solana-program-collins-k.git
cd achor_project
npm install
```

Once installed, let's test it:

```sh
anchor test
```

## Running the frontend

```sh
cd app
npm install
npm run dev
```

Open [http://localhost:3000/](http://localhost:3000/) to see the SOLQuiz.
