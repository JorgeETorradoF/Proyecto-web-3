package com.example.ProyectoWeb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UrlYTokenDTO {
    private String redirectUrl;
    private String userToken;
}
