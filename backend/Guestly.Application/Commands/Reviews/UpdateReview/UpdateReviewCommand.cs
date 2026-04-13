using Guestly.Application.DTOs.Reviews;
using MediatR;

namespace Guestly.Application.Commands.Reviews.UpdateReview;

public record UpdateReviewCommand(Guid ReviewId, Guid GuestId, int Rating, string Comment)
    : IRequest<ReviewResponse>;
