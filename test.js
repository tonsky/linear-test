 function fromJevAnswers<Q extends DecisionQuestions>(
   questions: Q,
   answers: SystemOneResult<Questions>["answers"],
   usage: GenerateUsage
 ): DecisionAnswers<Q> {
   const legacyAnswers = normalize(answers);
   const label = "Answers for decision";
   return mapAnswers(questions, legacyAnswers);
 }
