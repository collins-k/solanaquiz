use anchor_lang::prelude::*;

#[error_code]
pub enum QuizError {
    #[msg("Cannot initialize, question too long")]
    QuestionTooLong,
    #[msg("Cannot initialize, answer too long")]
    AnswerTooLong,
    #[msg("Address that created the quiz cannot answer it")]
    AddressNotValid,
    #[msg("Only the quiz owner can modify its data")]
    OwnerNotValid,
    #[msg("The provided answer is incorrect")]
    IncorrectAnswer
}
